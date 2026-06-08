let editor;
let pyodide;

let currentModule = 0;
let currentSection = 0;
let lastRenderedModule = -1;

// Firebase auth state
let currentUser = null;          // { uid, displayName, email, isGuest }
let firebaseReady = false;
let leaderboardUnsubscribe = null;
let saveTimer = null;            // debounced cloud save (progress)
let editorSaveTimer = null;      // debounced editor save
let chatSaveTimer = null;        // debounced chat save
let lastSessionSaveTimer = null; // debounced last-session save
let chatHistory = [];            // in-memory current section's chat (synced w/ localStorage)
let cloudHydrated = false;       // becomes true once cloud data has been merged in

// Cloudflare Worker � session-based access
const WORKER_BASE = "https://graphy-enrollment-webhook.powershell4u.workers.dev";

let labSession = null;

async function checkLabSession() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        let token = urlParams.get('session_token') || sessionStorage.getItem('lab_session_token') || '';
        if (token) {
            sessionStorage.setItem('lab_session_token', token);
            if (urlParams.get('session_token')) {
                urlParams.delete('session_token');
                urlParams.delete('access');
                const cleanUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
                window.history.replaceState({}, '', cleanUrl);
            }
        }
        if (!token) { labSession = { valid: false, reason: "no-token" }; return labSession; }
        const res = await fetch(WORKER_BASE + '/verify?token=' + encodeURIComponent(token));
        labSession = await res.json();
    } catch (e) {
        console.warn("Session verify failed:", e);
        labSession = { valid: false, reason: "network-error" };
    }
    return labSession;
}

function hasFullAccess() {
    return labSession && labSession.valid === true;
}

function isModuleLocked(moduleIdx) {
    if (moduleIdx < PREVIEW_MODULE_LIMIT) return false;
    return !hasFullAccess();
}


// OpenRouter API Configuration
// Key is injected at deploy time via GitHub Actions
const API_KEY_INJECTED = "__GEMINI_API_KEY__";
let OPENROUTER_API_KEY = API_KEY_INJECTED.startsWith("__") ? localStorage.getItem("openrouter_api_key") || "" : API_KEY_INJECTED;

// ===== GAMIFICATION SYSTEM =====

const LEVELS = [
    { level: 1, xp: 0, title: "Beginner" },
    { level: 2, xp: 50, title: "Explorer" },
    { level: 3, xp: 150, title: "Practitioner" },
    { level: 4, xp: 300, title: "Builder" },
    { level: 5, xp: 500, title: "Automator" },
    { level: 6, xp: 750, title: "Engineer" },
    { level: 7, xp: 1000, title: "Architect" },
    { level: 8, xp: 1500, title: "Expert" },
    { level: 9, xp: 2000, title: "Master" },
    { level: 10, xp: 3000, title: "Python Sage" }
];

const BADGES = [
    { id: "first-steps", name: "First Steps", icon: "??", desc: "Complete your first section" },
    { id: "first-run", name: "First Run", icon: "??", desc: "Run code for the first time" },
    { id: "python-beginner", name: "Python Beginner", icon: "??", desc: "Complete Python Basics module" },
    { id: "collection-master", name: "Collection Master", icon: "??", desc: "Complete Collections module" },
    { id: "flow-controller", name: "Flow Controller", icon: "??", desc: "Complete Control Flow module" },
    { id: "function-builder", name: "Function Builder", icon: "??", desc: "Complete Functions module" },
    { id: "error-handler", name: "Error Handler", icon: "???", desc: "Complete Error Handling module" },
    { id: "ai-explorer", name: "AI Explorer", icon: "??", desc: "Complete AI & ML module" },
    { id: "lab-rat", name: "Lab Rat", icon: "??", desc: "Complete 5 lab challenges" },
    { id: "streak-hero", name: "Streak Hero", icon: "??", desc: "Maintain a 7-day streak" },
    { id: "code-runner", name: "Code Runner", icon: "??", desc: "Run code 50 times" },
    { id: "champion", name: "Course Champion", icon: "??", desc: "Complete all modules" }
];

function getProgressKey() {
    const cid = (window.fbHelpers && window.fbHelpers.COURSE_ID) || 'default';
    return 'labProgress.' + cid;
}

function getProgress() {
    const defaults = {
        xp: 0, level: 1, streak: { current: 0, lastDate: "", best: 0 },
        completedSections: [], completedModules: [], codeRuns: 0,
        labsCompleted: 0, aiQuestions: 0, badges: [], firstVisit: new Date().toISOString().split('T')[0],
        "userName": localStorage.getItem('labUserName') || "Student"
    };
    try {
        const key = getProgressKey();
        const saved = localStorage.getItem(key);
        if (saved) return { ...defaults, ...JSON.parse(saved) };
        // Legacy "pythonLabProgress" is intentionally NOT auto-migrated here � it
        // contained XP from whichever course wrote last, so copying it forward
        // would leak progress between courses. Cloud is the source of truth on
        // sign-in. We only clear the legacy key so future reads start clean.
        if (localStorage.getItem("pythonLabProgress")) {
            localStorage.removeItem("pythonLabProgress");
        }
    } catch (e) {}
    return defaults;
}

function saveProgress(progress) {
    progress.lastSavedAt = Date.now();
    localStorage.setItem(getProgressKey(), JSON.stringify(progress));
    syncProgressToCloud(progress);
}

// Debounced sync of progress to Firebase
function syncProgressToCloud(progress) {
    if (!currentUser || currentUser.isGuest || !window.fbHelpers) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        const completedChallenges = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        const viewedSolutions = JSON.parse(localStorage.getItem('viewedChallengeSolutions') || '[]');
        window.fbHelpers.saveUser(currentUser.uid, {
            displayName: localStorage.getItem('labUserName') || currentUser.displayName || 'Student',
            xp: progress.xp || 0,
            level: getLevelInfo(progress.xp || 0).level,
            badges: progress.badges || [],
            completedSections: progress.completedSections || [],
            completedChallenges: completedChallenges,
            viewedChallengeSolutions: viewedSolutions,
            codeRuns: progress.codeRuns || 0,
            labsCompleted: progress.labsCompleted || 0,
            course: window.fbHelpers.COURSE_ID
        }).then(() => showSaveStatus('synced')).catch((err) => {
            console.warn("Cloud sync failed:", err);
            showSaveStatus('error');
        });
    }, 1500);
}

// ============================================================
// SESSION PERSISTENCE � last position, editor code, chat memory
// ============================================================

const STORAGE_KEYS = {
    lastSession: 'pyLab.lastSession',
    editorPrefix: 'pyLab.editor.',     // + sectionId
    chatPrefix:   'pyLab.chat.',       // + sectionId
    resumeShownKey: 'pyLab.resumeShown'
};

const MAX_CHAT_PER_SECTION = 20;
const MAX_EDITOR_SECTIONS = 50;
const RESUME_MAX_AGE_DAYS = 30;

// --- Last session (where the user left off) ---
function saveLastSession(moduleIdx, sectionIdx) {
    const payload = {
        moduleIdx,
        sectionIdx,
        moduleId: courseData.modules[moduleIdx] ? courseData.modules[moduleIdx].id : '',
        sectionId: courseData.modules[moduleIdx] && courseData.modules[moduleIdx].sections[sectionIdx]
            ? courseData.modules[moduleIdx].sections[sectionIdx].id
            : '',
        updatedAt: Date.now()
    };
    localStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify(payload));

    // Debounced cloud sync
    if (currentUser && !currentUser.isGuest && window.fbHelpers) {
        clearTimeout(lastSessionSaveTimer);
        lastSessionSaveTimer = setTimeout(() => {
            window.fbHelpers.saveLastSession(currentUser.uid, payload).catch(() => {});
        }, 800);
    }
}

function loadLastSession() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.lastSession);
        return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
}

// --- Editor code (per section) ---
function saveEditorCode(sectionId, code) {
    if (!sectionId) return;
    showSaveStatus('saving');
    try {
        localStorage.setItem(STORAGE_KEYS.editorPrefix + sectionId, code);
    } catch (e) {
        // Quota exceeded � prune oldest editor entries
        pruneEditorStorage();
        try { localStorage.setItem(STORAGE_KEYS.editorPrefix + sectionId, code); } catch (_) {}
    }
    showSaveStatus('saved');

    // Debounced cloud sync
    if (currentUser && !currentUser.isGuest && window.fbHelpers) {
        clearTimeout(editorSaveTimer);
        editorSaveTimer = setTimeout(() => {
            window.fbHelpers.saveEditorState(currentUser.uid, sectionId, code)
                .then(() => showSaveStatus('synced'))
                .catch(() => showSaveStatus('error'));
        }, 2000);
    }
}

function loadEditorCode(sectionId) {
    if (!sectionId) return null;
    return localStorage.getItem(STORAGE_KEYS.editorPrefix + sectionId);
}

function pruneEditorStorage() {
    // Keep at most MAX_EDITOR_SECTIONS most-recently-saved sections
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_KEYS.editorPrefix)) keys.push(k);
    }
    if (keys.length <= MAX_EDITOR_SECTIONS) return;
    // We don't track per-key timestamps separately � just drop the first N keys
    keys.slice(0, keys.length - MAX_EDITOR_SECTIONS).forEach(k => localStorage.removeItem(k));
}

// --- Chat history (per section) ---
function saveChatHistory(sectionId, messages) {
    if (!sectionId) return;
    // Cap to last N messages to keep things lean
    const trimmed = messages.slice(-MAX_CHAT_PER_SECTION);
    try {
        localStorage.setItem(STORAGE_KEYS.chatPrefix + sectionId, JSON.stringify(trimmed));
    } catch (e) {
        // Storage full � drop the oldest chat entry, retry once
        const k = findOldestChatKey();
        if (k) localStorage.removeItem(k);
        try { localStorage.setItem(STORAGE_KEYS.chatPrefix + sectionId, JSON.stringify(trimmed)); } catch (_) {}
    }

    if (currentUser && !currentUser.isGuest && window.fbHelpers) {
        clearTimeout(chatSaveTimer);
        chatSaveTimer = setTimeout(() => {
            window.fbHelpers.saveChatHistory(currentUser.uid, sectionId, trimmed)
                .catch(() => {});
        }, 2500);
    }
}

function loadChatHistory(sectionId) {
    if (!sectionId) return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.chatPrefix + sectionId);
        return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
}

function findOldestChatKey() {
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(STORAGE_KEYS.chatPrefix)) return k;
    }
    return null;
}

// --- Save status pill ---
function showSaveStatus(state) {
    const el = document.getElementById('saveStatus');
    if (!el) return;
    el.classList.remove('saving', 'saved', 'synced', 'error', 'local');
    switch (state) {
        case 'saving': el.classList.add('saving'); el.textContent = '? Saving�'; break;
        case 'saved':  el.classList.add('saved');  el.textContent = '? Saved';    break;
        case 'synced': el.classList.add('synced'); el.textContent = '? Synced';   break;
        case 'error':  el.classList.add('error');  el.textContent = '? Sync failed'; break;
        case 'local':  el.classList.add('local');  el.textContent = '? Local only'; break;
        default: el.textContent = '';
    }
    if (state === 'saved' || state === 'synced') {
        clearTimeout(el._fadeTimer);
        el._fadeTimer = setTimeout(() => {
            if (currentUser && currentUser.isGuest) showSaveStatus('local');
            else el.textContent = '';
        }, 2000);
    }
}

function showRestoredIndicator() {
    const el = document.getElementById('saveStatus');
    if (!el) return;
    el.classList.remove('saving', 'saved', 'synced', 'error', 'local');
    el.classList.add('restored');
    el.textContent = '? Restored your code';
    clearTimeout(el._fadeTimer);
    el._fadeTimer = setTimeout(() => {
        el.classList.remove('restored');
        if (currentUser && currentUser.isGuest) showSaveStatus('local');
        else el.textContent = '';
    }, 2500);
}

// --- Resume banner ---
function maybeShowResumeBanner() {
    const last = loadLastSession();
    if (!last || !last.updatedAt) return;
    if (Date.now() - last.updatedAt > RESUME_MAX_AGE_DAYS * 86400 * 1000) return;

    // Only show once per browser session
    if (sessionStorage.getItem(STORAGE_KEYS.resumeShownKey)) return;
    sessionStorage.setItem(STORAGE_KEYS.resumeShownKey, '1');

    // If we're already on the same module/section the user left off, skip
    if (last.moduleIdx === currentModule && last.sectionIdx === currentSection) return;

    const mod = courseData.modules[last.moduleIdx];
    if (!mod) return;
    const sec = mod.sections[last.sectionIdx];
    if (!sec) return;

    const banner = document.getElementById('resumeBanner');
    if (!banner) return;
    document.getElementById('resumeText').innerHTML =
        '?? Welcome back! Resume from <strong>' + mod.title + '</strong> &raquo; <strong>' + sec.title + '</strong>?';
    banner.style.display = 'flex';

    document.getElementById('resumeYes').onclick = () => {
        currentModule = last.moduleIdx;
        currentSection = last.sectionIdx;
        loadModulesPreserveSelection();
        banner.style.display = 'none';
    };
    document.getElementById('resumeNo').onclick = () => {
        banner.style.display = 'none';
    };
}

function loadModulesPreserveSelection() {
    document.getElementById('moduleSelect').value = currentModule;
    loadSections();
}

// ============================================================
// END SESSION PERSISTENCE
// ============================================================

function addXP(amount, label) {
    const progress = getProgress();
    const oldLevel = getLevelInfo(progress.xp).level;
    progress.xp += amount;
    const newLevelInfo = getLevelInfo(progress.xp);
    saveProgress(progress);
    updateGamificationUI();
    showXPFloat("+" + amount + " XP");
    if (newLevelInfo.level > oldLevel) {
        showLevelUp(newLevelInfo);
    }
}

function getLevelInfo(xp) {
    let current = LEVELS[0];
    for (const lvl of LEVELS) {
        if (xp >= lvl.xp) current = lvl;
        else break;
    }
    return current;
}

function getNextLevel(xp) {
    for (const lvl of LEVELS) {
        if (xp < lvl.xp) return lvl;
    }
    return LEVELS[LEVELS.length - 1];
}

function updateGamificationUI() {
    const progress = getProgress();
    const currentLvl = getLevelInfo(progress.xp);
    const nextLvl = getNextLevel(progress.xp);

    document.getElementById("xpLevel").textContent = "Lv." + currentLvl.level;
    document.getElementById("xpLevel").title = currentLvl.title;
    document.getElementById("xpText").textContent = progress.xp + " XP";

    // XP bar progress within current level
    const xpInLevel = progress.xp - currentLvl.xp;
    const xpNeeded = nextLvl.xp - currentLvl.xp;
    const pct = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));
    document.getElementById("xpBar").style.width = pct + "%";

    // Streak
    updateStreak();
    document.getElementById("streakDisplay").textContent = "??" + progress.streak.current;

    // Show user name
    const nameEl = document.getElementById('userName');
    if (nameEl) {
        const name = localStorage.getItem('labUserName') || 'Student';
        nameEl.textContent = '?? ' + name;
        nameEl.onclick = function() {
            const newName = prompt('Change your display name:', name);
            if (newName && newName.trim()) {
                const trimmed = newName.trim();
                localStorage.setItem('labUserName', trimmed);
                nameEl.textContent = '?? ' + trimmed;
                // Sync display name to Firebase profile + DB
                if (currentUser && !currentUser.isGuest && window.fbHelpers) {
                    window.fbHelpers.updateName(trimmed).catch(()=>{});
                    window.fbHelpers.saveUser(currentUser.uid, { displayName: trimmed }).catch(()=>{});
                }
            }
        };
    }
}

function updateStreak() {
    const progress = getProgress();
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    if (progress.streak.lastDate === today) return; // Already counted today

    if (progress.streak.lastDate === yesterday) {
        progress.streak.current += 1;
    } else if (progress.streak.lastDate !== today) {
        progress.streak.current = 1;
    }

    progress.streak.lastDate = today;
    if (progress.streak.current > progress.streak.best) {
        progress.streak.best = progress.streak.current;
    }
    saveProgress(progress);

    // Check streak badge
    if (progress.streak.current >= 7) awardBadge("streak-hero");
}

function awardBadge(badgeId) {
    const progress = getProgress();
    if (progress.badges.includes(badgeId)) return; // Already earned

    progress.badges.push(badgeId);
    saveProgress(progress);

    const badge = BADGES.find(b => b.id === badgeId);
    if (badge) showBadgePopup(badge);

    addXP(50, "Badge: " + badge.name);
}

function showBadgePopup(badge) {
    const popup = document.getElementById("badgePopup");
    document.getElementById("badgePopupIcon").textContent = badge.icon;
    document.getElementById("badgePopupTitle").textContent = badge.name;
    document.getElementById("badgePopupXp").textContent = "+50 XP";
    popup.style.display = "block";
    setTimeout(() => { popup.style.display = "none"; }, 4000);
}

function showXPFloat(text) {
    const el = document.getElementById("xpFloat");
    el.textContent = text;
    el.style.display = "block";
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "xpFloatUp 1.2s ease forwards";
    setTimeout(() => { el.style.display = "none"; }, 1300);
}

function showLevelUp(levelInfo) {
    const banner = document.getElementById("levelupBanner");
    document.getElementById("levelupText").textContent = "?? Level " + levelInfo.level + " � " + levelInfo.title + "!";
    banner.style.display = "block";
    banner.style.animation = "none";
    void banner.offsetWidth;
    banner.style.animation = "levelBannerIn 0.4s ease, levelBannerOut 0.4s 3s forwards";
    setTimeout(() => { banner.style.display = "none"; }, 3500);
}

function showBadges() {
    const progress = getProgress();
    const grid = document.getElementById("badgeGrid");
    grid.innerHTML = "";

    BADGES.forEach(badge => {
        const earned = progress.badges.includes(badge.id);
        const item = document.createElement("div");
        item.className = "badge-item" + (earned ? " earned" : " locked");
        item.innerHTML = '<span class="badge-icon">' + badge.icon + '</span><span class="badge-name">' + (earned ? badge.name : "???") + '</span>';
        item.title = earned ? badge.desc : "Locked";
        grid.appendChild(item);
    });

    document.getElementById("badgeStats").textContent = progress.badges.length + "/12 Unlocked";
    document.getElementById("badgeGallery").style.display = "flex";
}

function closeBadges() {
    document.getElementById("badgeGallery").style.display = "none";
}

function checkModuleBadges() {
    const progress = getProgress();
    const moduleMap = {
        2: "python-beginner",    // Module index 2 = Python Basics
        3: "collection-master",  // Module index 3 = Collections
        5: "flow-controller",    // Module index 5 = Control Flow
        6: "function-builder",   // Module index 6 = Functions
        7: "error-handler",      // Module index 7 = Error Handling
        12: "ai-explorer"        // Module index 12 = AI & ML
    };

    // Check if all sections in completed modules
    for (const [modIdx, badgeId] of Object.entries(moduleMap)) {
        const mod = courseData.modules[parseInt(modIdx)];
        if (!mod) continue;
        const allDone = mod.sections.every(s => progress.completedSections.includes(s.id));
        if (allDone) awardBadge(badgeId);
    }

    // Check champion
    const totalSections = courseData.modules.reduce((a, m) => a + m.sections.length, 0);
    if (progress.completedSections.length >= totalSections) awardBadge("champion");

    // Check lab rat
    if (progress.labsCompleted >= 5) awardBadge("lab-rat");

    // Check code runner
    if (progress.codeRuns >= 50) awardBadge("code-runner");
}

function trackCodeRun() {
    const progress = getProgress();
    const section = courseData.modules[currentModule].sections[currentSection];
    const runKey = "run_" + section.id;
    
    progress.codeRuns += 1;
    saveProgress(progress);

    if (progress.codeRuns === 1) awardBadge("first-run");
    checkModuleBadges();
    
    // Only award XP on first run per section
    if (!localStorage.getItem(runKey)) {
        localStorage.setItem(runKey, "1");
        addXP(10, "Run code");
    }
}

function trackSectionComplete() {
    const progress = getProgress();
    const section = courseData.modules[currentModule].sections[currentSection];
    if (!progress.completedSections.includes(section.id)) {
        progress.completedSections.push(section.id);
        saveProgress(progress);

        if (progress.completedSections.length === 1) awardBadge("first-steps");
        checkModuleBadges();
        addXP(5, "Section viewed");
    }
}

function trackLabComplete() {
    const progress = getProgress();
    progress.labsCompleted += 1;
    saveProgress(progress);
    checkModuleBadges();
    addXP(25, "Lab completed");
}

function trackAIQuestion() {
    const progress = getProgress();
    progress.aiQuestions += 1;
    saveProgress(progress);
    addXP(5, "AI question");
}

// ===== END GAMIFICATION SYSTEM =====

async function initializeApp() {

    const editorEl = document.getElementById("editor");
    if (!editorEl) return; // Not on the main page

    // Initialize editor & Pyodide first so they're ready when user logs in
    editor = CodeMirror.fromTextArea(
        editorEl,
        {
            mode: "python",
            theme: "material-darker",
            lineNumbers: true
        }
    );

    // Auto-save editor contents on every change (debounced via showSaveStatus)
    let editorAutoSaveTimer = null;
    editor.on("change", () => {
        clearTimeout(editorAutoSaveTimer);
        editorAutoSaveTimer = setTimeout(() => {
            const section = courseData.modules[currentModule] &&
                courseData.modules[currentModule].sections[currentSection];
            if (section && section.id) {
                saveEditorCode(section.id, editor.getValue());
            }
        }, 600);
    });

    pyodide = await loadPyodide();

    // Check Cloudflare Worker session
    await checkLabSession();


    // Wait for Firebase to be ready, then check auth state.
    // If Firebase never loads (CDN blocked, etc.) fall back to local-only mode after 4s.
    if (window.fbHelpers) {
        bootAuth();
    } else {
        let booted = false;
        const handler = () => { if (!booted) { booted = true; bootAuth(); } };
        window.addEventListener("firebase-ready", handler, { once: true });
        setTimeout(() => {
            if (!booted) {
                booted = true;
                console.warn("Firebase did not load � running in local-only mode.");
                hideAuthScreen();
                hideBootSplash();
                if (!localStorage.getItem('labUserName')) localStorage.setItem('labUserName', 'Student');
                currentUser = { uid: 'local-only', displayName: localStorage.getItem('labUserName'), email: '', isGuest: true };
                startMainApp();
            }
        }, 4000);
    }
}

function bootAuth() {
    firebaseReady = true;

    // One-click login: if URL has ?authToken=, sign in with it immediately
    const urlParams = new URLSearchParams(window.location.search);
    const authToken = urlParams.get('authToken');
    if (authToken && window.fbHelpers && window.fbHelpers.signInWithCustomToken) {
        window.fbHelpers.signInWithCustomToken(authToken).then(() => {
            // Clean the URL so the token doesn't sit in the address bar
            window.history.replaceState({}, '', window.location.pathname);
        }).catch((e) => {
            console.warn("Auto sign-in with token failed:", e && e.message);
        });
    }

    // Pre-fill email hint from ?hint= parameter  
    const emailHint = urlParams.get('hint');
    if (emailHint) {
        setTimeout(() => {
            const emailField = document.getElementById('authEmail');
            if (emailField) emailField.value = emailHint;
        }, 500);
    }
    window.fbHelpers.onAuthStateChanged(async (user) => {
        if (user) {
            // Pull the cloud record FIRST so a user's custom display name (set via
            // the rename dialog) wins over whatever Google's profile says today.
            let cloud = null;
            try {
                if (window.fbHelpers.migrateLegacyProgress) {
                    try { await window.fbHelpers.migrateLegacyProgress(user.uid); } catch (mErr) {
                        console.warn("Legacy progress migration skipped:", mErr);
                    }
                }
                cloud = await window.fbHelpers.loadUser(user.uid);
            } catch (e) {
                console.warn("Auth hydrate failed:", e);
            }

            const cloudName  = cloud && cloud.displayName ? cloud.displayName.trim() : "";
            const localName  = (localStorage.getItem('labUserName') || "").trim();
            const googleName = (user.displayName || "").trim();
            // Source-of-truth order: cloud (custom name) ? localStorage ? Google ? email prefix
            const preferredName = cloudName
                || localName
                || googleName
                || (user.email ? user.email.split('@')[0] : 'Student');

            currentUser = {
                uid: user.uid,
                displayName: preferredName,
                email: user.email || "",
                isGuest: user.isAnonymous
            };
            localStorage.setItem('labUserName', preferredName);

            try {
                if (cloud) {
                    mergeCloudIntoLocal(cloud);
                } else {
                    await window.fbHelpers.initUser(user.uid, {
                        email: currentUser.email,
                        displayName: preferredName,
                        photoURL: user.photoURL || ""
                    });
                }

                // If the user has a custom name but it's not yet on the cloud (e.g. they
                // renamed themselves while offline), persist it now so future devices see it.
                if (cloud && cloudName !== preferredName) {
                    window.fbHelpers.saveUser(user.uid, { displayName: preferredName }).catch(() => {});
                }

                // Pull editor + chat history into localStorage
                try {
                    const ec = await window.fbHelpers.loadEditorAndChat(user.uid);
                    hydrateEditorAndChatFromCloud(ec);
                } catch (e2) {
                    console.warn("Editor/chat hydrate failed:", e2);
                }

                // Claim any pending entitlement (call the Cloudflare Worker, which has admin
                // permissions and can read pendingEntitlements).
                try {
                    await claimPendingViaWorker(user.uid, user.email || "");
                } catch (eClaim) {
                    console.warn("claimPendingViaWorker failed:", eClaim);
                }

                // Hydrate entitlement state
                try {
                    if (window.fbHelpers.loadEntitlement) {
                        currentEntitlement = await window.fbHelpers.loadEntitlement(user.uid);
                    }
                    if (window.fbHelpers.subscribeEntitlement) {
                        if (entitlementUnsubscribe) entitlementUnsubscribe();
                        entitlementUnsubscribe = window.fbHelpers.subscribeEntitlement(user.uid, (ent) => {
                            const wasLocked  = !hasFullAccess();
                            currentEntitlement = ent;
                            const nowUnlocked = hasFullAccess();
                            // Rebuild module dropdown labels so ?? marks update
                            if (typeof loadModules === 'function' && document.getElementById('moduleSelect')) {
                                const sel = document.getElementById('moduleSelect');
                                Array.from(sel.options).forEach((opt, i) => {
                                    const m = courseData.modules[i];
                                    if (!m) return;
                                    opt.textContent = (isModuleLocked(i) ? '?? ' : '') + m.title;
                                    opt.style.color = isModuleLocked(i) ? '#94a3b8' : '';
                                });
                            }
                            if (wasLocked && nowUnlocked) {
                                showToast('?? Course unlocked! Welcome.');
                                renderSection();
                            }
                        });
                    }
                } catch (eEnt) {
                    console.warn("entitlement hydrate failed:", eEnt);
                }

                cloudHydrated = true;
            } catch (e) {
                console.warn("Auth hydrate failed:", e);
            }

            hideAuthScreen();
            hideBootSplash();
            startMainApp();
        } else {
            // Signed out � show login (guest still allowed)
            currentUser = null;
            hideBootSplash();
            hideAuthScreen(); startMainApp();
        }
    });
}

function hideBootSplash() {
    const s = document.getElementById('bootSplash');
    if (s) s.style.display = 'none';
}

// Merge cloud-stored progress into local storage so existing UI keeps working
function mergeCloudIntoLocal(cloud) {
    const local = getProgress();

    // If the cloud was reset by an admin AFTER our last local save, the cloud
    // is authoritative � wipe local. Otherwise merge optimistically.
    const cloudResetAt = typeof cloud.resetAt === 'number' ? cloud.resetAt : 0;
    const localSavedAt = typeof local.lastSavedAt === 'number' ? local.lastSavedAt : 0;
    const cloudWins = cloudResetAt > 0 && cloudResetAt >= localSavedAt;

    let merged;
    if (cloudWins) {
        // Adopt the cloud snapshot verbatim
        merged = {
            ...local,                       // keep userName, firstVisit, streak meta
            xp:                cloud.xp || 0,
            level:             cloud.level || 1,
            badges:            cloud.badges || [],
            completedSections: cloud.completedSections || [],
            codeRuns:          cloud.codeRuns || 0,
            labsCompleted:     cloud.labsCompleted || 0,
            lastSavedAt:       cloudResetAt
        };
        localStorage.setItem(getProgressKey(), JSON.stringify(merged));
        localStorage.setItem('completedChallenges',     JSON.stringify(cloud.completedChallenges || []));
        localStorage.setItem('viewedChallengeSolutions', JSON.stringify(cloud.viewedChallengeSolutions || []));
        console.info("Cloud reset detected � local progress replaced with cloud snapshot.");
    } else {
        merged = {
            ...local,
            xp: Math.max(local.xp || 0, cloud.xp || 0),
            badges: Array.from(new Set([...(local.badges || []), ...(cloud.badges || [])])),
            completedSections: Array.from(new Set([...(local.completedSections || []), ...(cloud.completedSections || [])])),
            codeRuns: Math.max(local.codeRuns || 0, cloud.codeRuns || 0),
            labsCompleted: Math.max(local.labsCompleted || 0, cloud.labsCompleted || 0)
        };
        localStorage.setItem(getProgressKey(), JSON.stringify(merged));

        const localCh = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
        const cloudCh = cloud.completedChallenges || [];
        localStorage.setItem('completedChallenges', JSON.stringify(Array.from(new Set([...localCh, ...cloudCh]))));

        const localViewed = JSON.parse(localStorage.getItem('viewedChallengeSolutions') || '[]');
        const cloudViewed = cloud.viewedChallengeSolutions || [];
        localStorage.setItem('viewedChallengeSolutions', JSON.stringify(Array.from(new Set([...localViewed, ...cloudViewed]))));
    }

    // Cloud's display name might be older than the in-memory current name �
    // bootAuth has already chosen the correct one. Don't overwrite it.
    if (cloud.displayName && !currentUser) localStorage.setItem('labUserName', cloud.displayName);

    // Hydrate last-session pointer if it's newer than local
    if (cloud.lastSession && cloud.lastSession.updatedAt) {
        const localLast = loadLastSession();
        const localTs = localLast && localLast.updatedAt ? localLast.updatedAt : 0;
        const cloudTs = typeof cloud.lastSession.updatedAt === 'number'
            ? cloud.lastSession.updatedAt
            : 0;
        if (cloudTs > localTs) {
            localStorage.setItem(STORAGE_KEYS.lastSession, JSON.stringify({
                moduleIdx: cloud.lastSession.moduleIdx || 0,
                sectionIdx: cloud.lastSession.sectionIdx || 0,
                moduleId: cloud.lastSession.moduleId || '',
                sectionId: cloud.lastSession.sectionId || '',
                updatedAt: cloudTs
            }));
        }
    }
}

// Pull every section's editor code + chat into localStorage so opening a section
// instantly shows what the user last had � no extra round-trips needed.
function hydrateEditorAndChatFromCloud({ editorState, chatHistory: chatMap }) {
    if (editorState && typeof editorState === 'object') {
        Object.keys(editorState).forEach(sectionId => {
            const entry = editorState[sectionId];
            if (entry && typeof entry.code === 'string') {
                try { localStorage.setItem(STORAGE_KEYS.editorPrefix + sectionId, entry.code); } catch (_) {}
            }
        });
    }
    if (chatMap && typeof chatMap === 'object') {
        Object.keys(chatMap).forEach(sectionId => {
            const entry = chatMap[sectionId];
            if (entry && Array.isArray(entry.messages)) {
                try { localStorage.setItem(STORAGE_KEYS.chatPrefix + sectionId, JSON.stringify(entry.messages)); } catch (_) {}
            }
        });
    }
}

function startMainApp() {
    // Honour a previously saved last position (cloud-merged or local-only)
    const last = loadLastSession();
    if (last && typeof last.moduleIdx === 'number') {
        const m = courseData.modules[last.moduleIdx];
        if (m && m.sections[last.sectionIdx]) {
            currentModule = last.moduleIdx;
            currentSection = last.sectionIdx;
        }
    }

    loadModules();
    updateGamificationUI();
    updateProgress();

    // Surface the resume banner shortly after first render
    setTimeout(maybeShowResumeBanner, 400);

    // Initial save status pill state
    if (currentUser && currentUser.isGuest) showSaveStatus('local');
}

function showAuthScreen() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.style.display = 'flex';
}

function hideAuthScreen() {
    const overlay = document.getElementById('authOverlay');
    if (overlay) overlay.style.display = 'none';
}

// ===== Auth UI Handlers =====

function authSwitchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`.auth-tab[data-tab="${tab}"]`).classList.add('active');
    const nameInput = document.getElementById('authName');
    const submitBtn = document.getElementById('authSubmitBtn');
    if (tab === 'signup') {
        nameInput.style.display = 'block';
        submitBtn.textContent = 'Create Account';
    } else {
        nameInput.style.display = 'none';
        submitBtn.textContent = 'Sign In';
    }
    document.getElementById('authError').textContent = '';
}

async function authSubmit() {
    const errorEl = document.getElementById('authError');
    errorEl.textContent = '';
    const email = document.getElementById('authEmail').value.trim();
    const password = document.getElementById('authPassword').value;
    const isSignup = document.querySelector('.auth-tab.active').dataset.tab === 'signup';
    const name = document.getElementById('authName').value.trim();

    if (!email || !password) {
        errorEl.textContent = 'Email and password are required.';
        return;
    }
    if (isSignup && password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters.';
        return;
    }

    try {
        if (isSignup) {
            await window.fbHelpers.signUpEmail(email, password, name || email.split('@')[0]);
        } else {
            await window.fbHelpers.signInEmail(email, password);
        }
    } catch (err) {
        errorEl.textContent = friendlyAuthError(err);
    }
}

async function authSignInGoogle() {
    try {
        await window.fbHelpers.signInGoogle();
    } catch (err) {
        document.getElementById('authError').textContent = friendlyAuthError(err);
    }
}

async function authSignInGuest() {
    try {
        // Try Firebase anonymous auth first; if disabled, fall back to local-only mode
        await window.fbHelpers.signInAnonymous();
    } catch (err) {
        // Fallback: pure local mode (no leaderboard participation)
        currentUser = { uid: 'guest-local', displayName: localStorage.getItem('labUserName') || 'Guest', email: '', isGuest: true };
        if (!localStorage.getItem('labUserName')) localStorage.setItem('labUserName', 'Guest');
        hideAuthScreen();
        startMainApp();
    }
}

async function authSignOut() {
    if (!confirm('Sign out? You will be redirected to PowerShell Academy.')) return;
    sessionStorage.removeItem('lab_session_token');
    if (window.fbHelpers) { try { await window.fbHelpers.signOut(); } catch(e){} }
    window.location.href = "https://graphy-enrollment-webhook.powershell4u.workers.dev/sso/logout";
}


function friendlyAuthError(err) {
    const code = (err && err.code) || '';
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'Email or password is incorrect.';
    if (code.includes('email-already-in-use')) return 'This email is already registered. Try Sign In.';
    if (code.includes('invalid-email')) return 'Please enter a valid email address.';
    if (code.includes('weak-password')) return 'Password is too weak (use 6+ characters).';
    if (code.includes('popup-closed-by-user')) return 'Google sign-in cancelled.';
    if (code.includes('operation-not-allowed')) return 'This sign-in method is disabled. Contact your instructor.';
    return (err && err.message) || 'Sign-in failed. Try again.';
}

function loadModules() {

    const moduleSelect = document.getElementById("moduleSelect");
    moduleSelect.innerHTML = "";

    courseData.modules.forEach((module, index) => {

        const option = document.createElement("option");

        option.value = index;
        const lockMark = isModuleLocked(index) ? '?? ' : '';
        option.textContent = lockMark + module.title;
        if (isModuleLocked(index)) option.style.color = '#94a3b8';

        moduleSelect.appendChild(option);
    });

    moduleSelect.value = currentModule;

    moduleSelect.onchange = function () {

        currentModule = parseInt(this.value);
        currentSection = 0;

        loadSections();
    };

    loadSections();
}

function loadSections() {

    const sectionSelect = document.getElementById("sectionSelect");
    sectionSelect.innerHTML = "";

    const sections =
        courseData.modules[currentModule].sections;

    const completed = JSON.parse(localStorage.getItem('completedSections') || '[]');

    sections.forEach((section, index) => {

        const option = document.createElement("option");

        option.value = index;
        const mark = completed.includes(section.id) ? '? ' : '? ';
        option.textContent = mark + section.title;

        sectionSelect.appendChild(option);
    });

    sectionSelect.value = currentSection;

    sectionSelect.onchange = function () {

        currentSection = parseInt(this.value);

        renderSection();
    };

    renderSection();
}

function renderSection() {

    const section =
        courseData.modules[currentModule]
        .sections[currentSection];

    // Entitlement gate � modules beyond the preview limit need an active entitlement.
    if (isModuleLocked(currentModule)) {
        renderLockedSection();
        return;
    } else {
        const lock = document.getElementById('lockedCard');
        if (lock) lock.style.display = 'none';
    }

    // Show lab objective card when entering a new module
    const card = document.getElementById('labObjectiveCard');
    const module = courseData.modules[currentModule];
    if (currentModule !== lastRenderedModule && module.labObjective) {
        lastRenderedModule = currentModule;
        const obj = module.labObjective;
        document.getElementById('labObjText').textContent = obj.objective;
        document.getElementById('labObjTime').textContent = '? ' + obj.duration;

        const diffEl = document.getElementById('labObjDifficulty');
        diffEl.textContent = '?? ' + obj.difficulty;
        diffEl.className = 'lab-obj-badge difficulty ' + obj.difficulty.toLowerCase();

        document.getElementById('labObjSkills').innerHTML = obj.skills.map(s => '<span>' + s + '</span>').join('');
        document.getElementById('labObjTech').innerHTML = obj.technologies.map(t => '<span>' + t + '</span>').join('');

        card.style.display = 'block';
    } else if (currentModule !== lastRenderedModule) {
        card.style.display = 'none';
        lastRenderedModule = currentModule;
    }

    document.getElementById("moduleSelect").value =
        currentModule;

    document.getElementById("sectionSelect").value =
        currentSection;

    let content = section.brief || section.description;
    // Remove the h4 heading from content (it's shown separately above diagram)
    content = content.replace(/<h4>.*?<\/h4>/, "");
    document.getElementById("description").innerHTML = content;

    // Set heading above diagram
    document.getElementById("sectionHeading").textContent = section.title;

    // Initialize reveal animation for bullet points
    initReveal();

    document.getElementById("syntax").textContent =
        section.syntax;

    updateDiagram(section);

    renderTabs(section, 0);

    if (section.examples.length > 0) {

        editor.setValue(section.examples[0].code);

    } else {

        editor.setValue("# No examples available");
    }

    // === SESSION PERSISTENCE: restore saved code if present ===
    const savedCode = loadEditorCode(section.id);
    if (savedCode != null && savedCode.length > 0) {
        editor.setValue(savedCode);
        showRestoredIndicator();
    }

    // Restore chat history for this section
    restoreChatHistory(section.id);

    // Save current position (debounced inside)
    saveLastSession(currentModule, currentSection);
    // === END SESSION PERSISTENCE ===

    // Pulse toggle when section has code
    const toggleBtn = document.getElementById('panelToggle');
    if (section.examples && section.examples.length > 0) {
        toggleBtn.classList.add('has-code');
    } else {
        toggleBtn.classList.remove('has-code');
    }

    // Update breadcrumb
    document.getElementById('breadcrumb').textContent =
        courseData.modules[currentModule].title + ' > ' + section.title;

    // Update section indicator
    const totalInModule = courseData.modules[currentModule].sections.length;
    document.getElementById('sectionIndicator').textContent =
        (currentSection + 1) + ' / ' + totalInModule;

    // Update file badge
    if (section.examples && section.examples.length > 0) {
        document.getElementById('fileBadge').textContent = '?? ' + section.examples[0].name + '.py';
    } else {
        document.getElementById('fileBadge').textContent = '?? scratch.py';
    }

    // Update line count
    setTimeout(() => {
        if (editor) document.getElementById('lineCount').textContent = 'Ln ' + editor.lineCount();
    }, 100);

    // Show/hide hands-on lab
    const labSection = document.getElementById('labSection');
    if (section.lab) {
        labSection.style.display = 'block';
        document.getElementById('labTask').textContent = section.lab.task;
        document.getElementById('labFeedback').style.display = 'none';
    } else {
        labSection.style.display = 'none';
    }

    // Mark previous section complete
    markSectionComplete();
    updateProgress();
    trackSectionComplete();
}

function renderTabs(section, activeIndex) {

    const tabs = document.getElementById("exampleTabs");

    tabs.innerHTML = "";

    // Helper to update active button highlight
    function setActiveTab(btn) {
        tabs.querySelectorAll(".example-btn").forEach(b =>
            b.classList.remove("active-tab")
        );
        btn.classList.add("active-tab");
    }

    const scratchButton =
        document.createElement("button");

    scratchButton.innerText = "? Scratch Pad";
    scratchButton.className = "example-btn";

    scratchButton.onclick = () => {

        setActiveTab(scratchButton);

        editor.setValue(
            localStorage.getItem(section.id)
            || "# Scratch Pad"
        );
    };

    tabs.appendChild(scratchButton);

    section.examples.forEach((example, index) => {

        const button =
            document.createElement("button");

        button.className = "example-btn level-" + (example.level || "beginner");

        button.innerText = example.name;

        button.onclick = () => {

            setActiveTab(button);

            editor.setValue(example.code);
        };

        tabs.appendChild(button);

        // Highlight the initially active example tab
        if (index === activeIndex) {
            button.classList.add("active-tab");
        }
    });
}

function updateDiagram(section) {

    const container =
        document.querySelector(".diagram-box");

    // Use section's own diagram HTML if provided
    if (section.diagram) {
        container.innerHTML = section.diagram;
        return;
    }

    const title = section.title;
    const id = section.id || "";

    // Look up diagram type by section ID, fall back to "generic"
    const diagramType = sectionDiagramTypes[id] || "generic";

    // Replace the element to force animation restart
    const newBox = container.cloneNode(false);
    newBox.innerHTML = getDiagramSVG(diagramType, title);
    container.parentNode.replaceChild(newBox, container);
}

async function runCode() {

    const output =
        document.getElementById("output");

    output.textContent = "";

    try {

        pyodide.setStdout({
            batched: (message) => {

                output.textContent +=
                    message + "\n";
            }
        });

        await pyodide.runPythonAsync(
            editor.getValue()
        );

        trackCodeRun();

    } catch (error) {

        output.textContent = error;
    }
}

async function runSelected() {

    const output =
        document.getElementById("output");

    const selected = editor.getSelection();

    if (!selected.trim()) {
        output.textContent = "? No code selected. Highlight lines to run them.";
        return;
    }

    output.textContent = "";

    try {

        pyodide.setStdout({
            batched: (message) => {

                output.textContent +=
                    message + "\n";
            }
        });

        await pyodide.runPythonAsync(selected);

        trackCodeRun();

    } catch (error) {

        output.textContent = error;
    }
}

function clearOutput() {

    document.getElementById("output")
        .textContent = "";
}

function copyCode() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        showToast('?? Code copied to clipboard!');
    });
}

let revealItems = [];
let revealIndex = 0;

function initReveal() {
    const desc = document.getElementById("description");
    revealItems = desc.querySelectorAll("li");
    revealIndex = 0;
    updateRevealCounter();
}

function revealNext() {
    if (revealIndex < revealItems.length) {
        const item = revealItems[revealIndex];
        item.style.transitionDelay = '0ms';
        item.classList.add("revealed");
        revealIndex++;
        updateRevealCounter();
    }
}

function revealAll() {
    revealItems.forEach((item, i) => {
        setTimeout(() => {
            item.classList.add("revealed");
        }, i * 50);
    });
    revealIndex = revealItems.length;
    updateRevealCounter();
}

function updateRevealCounter() {
    const counter = document.getElementById("revealCount");
    if (counter) {
        if (revealItems.length === 0) {
            counter.textContent = "";
        } else {
            counter.textContent = `${revealIndex} / ${revealItems.length}`;
        }
    }
}

function previousSection() {

    if (currentSection > 0) {

        currentSection--;

    } else if (currentModule > 0) {

        currentModule--;

        currentSection =
            courseData.modules[currentModule]
            .sections.length - 1;

        loadSections();

        return;
    }

    renderSection();
}

function nextSection() {

    // If there are unrevealed bullets, reveal next one first (PPT mode)
    if (revealIndex < revealItems.length) {
        revealNext();
        return;
    }

    const totalSections =
        courseData.modules[currentModule]
        .sections.length;

    if (currentSection < totalSections - 1) {

        currentSection++;

    } else if (
        currentModule <
        courseData.modules.length - 1
    ) {

        currentModule++;
        currentSection = 0;

        showToast('?? Module Complete!');
        addXP(50, "Module complete");

        loadSections();

        return;
    }

    renderSection();
}

function toggleDescription() {

    document.querySelector(".left-panel")
        .classList.toggle("fullscreen");
}

// ===== Panel Tab Switching =====

function showPanelTab(tab) {
    document.querySelectorAll('.panel-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.panel-tab').forEach(el => el.classList.remove('active'));

    if (tab === 'editor') {
        document.getElementById('panelEditor').classList.remove('hidden');
        document.querySelectorAll('.panel-tab')[0].classList.add('active');
        setTimeout(() => { if (editor) editor.refresh(); }, 50);
    } else if (tab === 'output') {
        document.getElementById('panelOutput').classList.remove('hidden');
        document.querySelectorAll('.panel-tab')[1].classList.add('active');
    } else if (tab === 'chat') {
        document.getElementById('panelChat').classList.remove('hidden');
        document.querySelectorAll('.panel-tab')[2].classList.add('active');
    }
}

// ===== Markdown Formatting =====

function formatMarkdown(text) {
    // Handle code blocks (```) first
    text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, function(match, lang, code) {
        return '<pre>' + code.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>';
    });
    // Handle inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Handle bold
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Handle italic
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Handle line breaks
    text = text.replace(/\n\n/g, '<br><br>');
    text = text.replace(/\n/g, '<br>');
    return text;
}

// ===== Quick AI Actions =====

function quickAsk(question) {
    document.getElementById('chatInput').value = question;
    sendChat();
}

// ===== Toast Notification =====

function showToast(message) {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// ===== Progress Tracking =====

function updateProgress() {
    const totalSections = courseData.modules.reduce((a, m) => a + m.sections.length, 0);
    const completed = JSON.parse(localStorage.getItem('completedSections') || '[]');
    const pct = Math.round((completed.length / totalSections) * 100);
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    if (bar) bar.style.setProperty('--progress', pct + '%');
    if (text) text.textContent = pct + '%';
}

function markSectionComplete() {
    const section = courseData.modules[currentModule].sections[currentSection];
    const completed = JSON.parse(localStorage.getItem('completedSections') || '[]');
    if (!completed.includes(section.id)) {
        completed.push(section.id);
        localStorage.setItem('completedSections', JSON.stringify(completed));
    }
    updateProgress();
}

// ===== Right Panel Toggle =====

function toggleRightPanel() {
    var panel = document.getElementById('rightPanel');
    var toggle = document.getElementById('panelToggle');
    var left = document.getElementById('leftPanel');

    panel.classList.toggle('open');
    toggle.classList.toggle('shifted');
    left.classList.toggle('shifted');

    if (panel.classList.contains('open')) {
        toggle.innerHTML = '&#x25B6; Close';
        // Stop pulse when panel is opened
        toggle.classList.remove('has-code');
    } else {
        toggle.innerHTML = '&#x25C0; Code &amp; AI';
    }

    // Refresh CodeMirror after transition
    setTimeout(function() { if (editor) editor.refresh(); }, 350);
}

// ===== AI Chat Functions =====

function addChatMessage(text, role, opts) {
    const messages = document.getElementById("chatMessages");
    const msg = document.createElement("div");
    const isUser = role.includes("user");
    msg.className = "ai-msg " + (isUser ? "user" : "assistant");
    
    const avatar = document.createElement("div");
    avatar.className = "ai-msg-avatar";
    avatar.textContent = isUser ? "??" : "??";
    
    const bubble = document.createElement("div");
    bubble.className = "ai-msg-bubble";
    bubble.innerHTML = text;
    
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;

    // Persist message unless caller opted out (e.g. transient "thinking�" indicator)
    if (!(opts && opts.transient) && !role.includes("loading")) {
        const sec = courseData.modules[currentModule] &&
            courseData.modules[currentModule].sections[currentSection];
        if (sec && sec.id) {
            chatHistory.push({ role: isUser ? "user" : "assistant", text, ts: Date.now() });
            // Trim in-memory copy
            if (chatHistory.length > MAX_CHAT_PER_SECTION) {
                chatHistory = chatHistory.slice(-MAX_CHAT_PER_SECTION);
            }
            saveChatHistory(sec.id, chatHistory);
        }
    }

    return msg;
}

function restoreChatHistory(sectionId) {
    const messages = document.getElementById("chatMessages");
    if (!messages) return;
    // Reset to the welcome state
    messages.innerHTML =
        '<div class="ai-msg assistant">' +
            '<div class="ai-msg-avatar">??</div>' +
            '<div class="ai-msg-bubble">Hey! I\'m your AI mentor for this module. I can see your code and output � ask me anything!</div>' +
        '</div>';

    chatHistory = loadChatHistory(sectionId);
    if (!chatHistory || chatHistory.length === 0) return;

    // Re-render persisted messages without re-saving
    chatHistory.forEach(m => {
        const wrap = document.createElement("div");
        const isUser = m.role === "user";
        wrap.className = "ai-msg " + (isUser ? "user" : "assistant");
        const av = document.createElement("div");
        av.className = "ai-msg-avatar";
        av.textContent = isUser ? "??" : "??";
        const b = document.createElement("div");
        b.className = "ai-msg-bubble";
        b.innerHTML = m.text;
        wrap.appendChild(av);
        wrap.appendChild(b);
        messages.appendChild(wrap);
    });
    messages.scrollTop = messages.scrollHeight;
}

async function sendChat() {
    const input = document.getElementById("chatInput");
    const question = input.value.trim();
    if (!question) return;

    input.value = "";
    addChatMessage(question, "user");

    if (!OPENROUTER_API_KEY) {
        const key = prompt("Enter the AI API key (provided by your instructor):");
        if (key && key.trim()) {
            OPENROUTER_API_KEY = key.trim();
            localStorage.setItem("openrouter_api_key", OPENROUTER_API_KEY);
        } else {
            addChatMessage("No API key provided. Ask your instructor for the key.", "bot");
            return;
        }
    }

    const loadingMsg = addChatMessage('<span class="typing-dots"><span>?</span><span>?</span><span>?</span></span>', "bot loading", { transient: true });

    const code = editor ? editor.getValue() : "";
    const section = courseData.modules[currentModule].sections[currentSection];

    const chatPrompt = `You are a helpful Python tutor for IT professionals learning Python for automation and AI. You ONLY answer questions related to Python programming, the code shown below, or the course topic. If the question is unrelated to Python or the code, politely decline and ask them to keep questions relevant to the course material.

The student is currently studying: "${section.title}"

Here is the code they are looking at:
\`\`\`python
${code}
\`\`\`

The student asks: "${question}"

Give a clear, helpful answer. If the question is about the code, refer to specific lines. If it's a general Python question related to the course, answer it directly. If it's completely unrelated to Python or programming, politely say you can only help with Python and course-related questions. Keep the answer concise but complete (4-6 sentences).`;

    const models = [
        "google/gemma-4-31b-it:free",
        "nvidia/nemotron-nano-9b-v2:free",
        "openai/gpt-oss-20b:free",
        "google/gemma-4-26b-a4b-it:free"
    ];

    let lastError = "";
    for (const model of models) {
        try {
            console.log("Trying model:", model);
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": window.location.href,
                    "X-Title": "Python for AI - Interactive Course"
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: chatPrompt }],
                    max_tokens: 1024,
                    temperature: 0.7
                })
            });

            const data = await response.json();

            if (data.choices && data.choices[0] && data.choices[0].message) {
                let answer = data.choices[0].message.content || "";
                if (answer.trim()) {
                    loadingMsg.remove();
                    answer = formatMarkdown(answer);
                    addChatMessage(answer, "bot");
                    trackAIQuestion();
                    return;
                }
            }
            lastError = data.error ? data.error.message : "Empty response";
            console.log("Model failed:", model, lastError);
        } catch (err) {
            lastError = err.message;
            console.log("Model error:", model, err.message);
        }
    }

    loadingMsg.remove();
    addChatMessage(`All models busy. Please try again in a moment. (${lastError})`, "bot");
}

// ===== Lab Evaluation =====

function checkAnswer() {
    const section = courseData.modules[currentModule].sections[currentSection];
    if (!section.lab) return;
    
    // Open right panel if closed
    const panel = document.getElementById('rightPanel');
    if (!panel.classList.contains('open')) toggleRightPanel();
    
    const code = editor ? editor.getValue() : "";
    const feedback = document.getElementById('labFeedback');
    feedback.style.display = 'block';
    feedback.className = 'lab-feedback';
    feedback.innerHTML = '<span class="typing-dots"><span>?</span><span>?</span><span>?</span></span> Evaluating...';
    
    const evalPrompt = `You are evaluating a beginner's Python code for a learning exercise.

TASK: ${section.lab.task}

REQUIREMENTS: ${section.lab.requirements.join(", ")}

STUDENT'S CODE:
\`\`\`python
${code}
\`\`\`

Evaluate the code. Be encouraging and beginner-friendly. Format your response EXACTLY like this:

VERDICT: PASS or NEEDS_WORK
? [list what they got right, one per line]
? [list what's missing or wrong, one per line, only if NEEDS_WORK]
?? [one specific improvement tip]
?? [one sentence of encouragement]`;

    // Use the AI to evaluate
    callAIForLab(evalPrompt, feedback);
}

async function callAIForLab(prompt, feedbackEl, onResult) {
    if (!OPENROUTER_API_KEY) {
        const key = window.prompt("Enter the AI API key (provided by your instructor):");
        if (key && key.trim()) {
            OPENROUTER_API_KEY = key.trim();
            localStorage.setItem("openrouter_api_key", OPENROUTER_API_KEY);
        } else {
            feedbackEl.innerHTML = "No API key. Ask your instructor.";
            if (onResult) onResult(false);
            return;
        }
    }
    
    const models = ["google/gemma-4-31b-it:free","nvidia/nemotron-nano-9b-v2:free","openai/gpt-oss-20b:free"];
    
    for (const model of models) {
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + OPENROUTER_API_KEY,
                    "HTTP-Referer": window.location.href
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: 512,
                    temperature: 0.5
                })
            });
            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
                let answer = data.choices[0].message.content;
                const isPass = /VERDICT:\s*PASS\b/i.test(answer);
                feedbackEl.className = 'lab-feedback ' + (isPass ? 'pass' : 'needs-work');
                answer = answer.replace(/VERDICT:\s*(PASS|NEEDS_WORK)/gi, isPass ? '? PASS � Well done!' : '?? NEEDS WORK � Keep trying!');
                answer = answer.replace(/\n/g, '<br>');
                feedbackEl.innerHTML = answer;
                if (isPass) { trackLabComplete(); addXP(25, "Lab passed"); }
                if (onResult) onResult(isPass);
                return;
            }
        } catch (e) { continue; }
    }
    feedbackEl.innerHTML = "AI is busy. Try again in a moment.";
    if (onResult) onResult(false);
}

function showHint() {
    const section = courseData.modules[currentModule].sections[currentSection];
    if (!section.lab) return;
    const feedback = document.getElementById('labFeedback');
    feedback.style.display = 'block';
    feedback.className = 'lab-feedback';
    feedback.innerHTML = '?? <strong>Hint:</strong> ' + section.lab.hint;
}

function showSolution() {
    const section = courseData.modules[currentModule].sections[currentSection];
    if (!section.lab) return;
    const feedback = document.getElementById('labFeedback');
    feedback.style.display = 'block';
    feedback.className = 'lab-feedback';
    feedback.innerHTML = '?? <strong>Solution:</strong><br><pre style="background:#111827;padding:10px;border-radius:6px;margin-top:8px;color:#00d4aa;font-size:12px;white-space:pre-wrap;">' + section.lab.solution + '</pre>';
}

// ===== CHALLENGE MODE =====

const CHALLENGES = [
    {
        id: "ch1",
        title: "Print the Current Year",
        task: "Create a variable called `year` set to 2025.\nPrint it using an f-string: \"The year is 2025\"",
        hints: ["Use year = 2025", "Use f\"The year is {year}\""],
        solution: "year = 2025\nprint(f\"The year is {year}\")",
        requirements: ["variable year", "f-string", "print"]
    },
    {
        id: "ch2",
        title: "Server Status Check",
        task: "Create a variable `cpu` set to 88.\nWrite an if/else that prints \"ALERT\" if cpu > 85, else prints \"OK\".",
        hints: ["Start with cpu = 88", "Use if cpu > 85:"],
        solution: "cpu = 88\nif cpu > 85:\n    print(\"ALERT\")\nelse:\n    print(\"OK\")",
        requirements: ["variable cpu", "if/else", "prints ALERT or OK"]
    },
    {
        id: "ch3",
        title: "Count Servers in a List",
        task: "Create a list with 5 server names.\nPrint how many servers are in the list using len().",
        hints: ["servers = [\"web-01\", \"web-02\", ...]", "Use len(servers)"],
        solution: "servers = [\"web-01\", \"web-02\", \"db-01\", \"cache-01\", \"backup-01\"]\nprint(f\"Total servers: {len(servers)}\")",
        requirements: ["list with 5 items", "len() used", "print"]
    },
    {
        id: "ch4",
        title: "Loop Through Servers",
        task: "Create a list of 3 servers.\nLoop through them and print each server name with its index (1, 2, 3).",
        hints: ["Use enumerate(servers, 1)", "for i, s in enumerate(...)"],
        solution: "servers = [\"web-01\", \"db-01\", \"cache-01\"]\nfor i, server in enumerate(servers, 1):\n    print(f\"{i}. {server}\")",
        requirements: ["list", "for loop", "enumerate or index", "prints numbered list"]
    },
    {
        id: "ch5",
        title: "Dictionary Lookup",
        task: "Create a dictionary with keys: name, cpu, status.\nPrint the value of 'name' using bracket notation.",
        hints: ["server = {\"name\": \"web-01\", ...}", "Use server[\"name\"]"],
        solution: "server = {\"name\": \"web-01\", \"cpu\": 72, \"status\": \"online\"}\nprint(server[\"name\"])",
        requirements: ["dictionary with 3 keys", "bracket access", "print"]
    },
    {
        id: "ch6",
        title: "Simple Function",
        task: "Write a function called `greet(name)` that returns f\"Hello, {name}!\".\nCall it with \"Alice\" and print the result.",
        hints: ["def greet(name):", "return f\"Hello, {name}!\""],
        solution: "def greet(name):\n    return f\"Hello, {name}!\"\n\nresult = greet(\"Alice\")\nprint(result)",
        requirements: ["function greet", "parameter name", "returns f-string", "prints result"]
    },
    {
        id: "ch7",
        title: "Try/Except Safety",
        task: "Write code that tries to convert \"abc\" to an integer.\nCatch the ValueError and print \"Not a number!\".",
        hints: ["try: int(\"abc\")", "except ValueError:"],
        solution: "try:\n    value = int(\"abc\")\nexcept ValueError:\n    print(\"Not a number!\")",
        requirements: ["try block", "int() conversion", "except ValueError", "prints error message"]
    },
    {
        id: "ch8",
        title: "JSON Round-Trip",
        task: "Import json.\nCreate a dict with name and age.\nConvert to JSON string, print it.\nParse it back and print the name.",
        hints: ["import json", "json.dumps(data)", "json.loads(json_str)"],
        solution: "import json\n\ndata = {\"name\": \"Alice\", \"age\": 30}\njson_str = json.dumps(data)\nprint(json_str)\n\nparsed = json.loads(json_str)\nprint(parsed[\"name\"])",
        requirements: ["import json", "dictionary", "json.dumps", "json.loads", "print both"]
    },
    {
        id: "ch9",
        title: "List Comprehension Filter",
        task: "Given numbers = [10, 25, 80, 45, 92, 55, 88]\nUse a list comprehension to get only numbers > 50.\nPrint the filtered list.",
        hints: ["[x for x in numbers if x > 50]", "Store in a variable, then print"],
        solution: "numbers = [10, 25, 80, 45, 92, 55, 88]\nhigh = [x for x in numbers if x > 50]\nprint(high)",
        requirements: ["list comprehension", "filter > 50", "print result"]
    },
    {
        id: "ch10",
        title: "Format Bytes Function",
        task: "Write a function format_size(bytes) that:\n- Returns \"X.X KB\" if bytes >= 1024\n- Returns \"X B\" otherwise\nTest with 500 and 2048.",
        hints: ["if bytes >= 1024: return f\"{bytes/1024:.1f} KB\"", "else: return f\"{bytes} B\""],
        solution: "def format_size(b):\n    if b >= 1024:\n        return f\"{b/1024:.1f} KB\"\n    return f\"{b} B\"\n\nprint(format_size(500))\nprint(format_size(2048))",
        requirements: ["function format_size", "if/else for KB", "returns string", "two test calls"]
    }
];

let currentChallenge = null;
let challengeHintIndex = 0;

function openChallengeMode() {
    document.getElementById('challengeOverlay').style.display = 'flex';
    showChallengeList();
}

function closeChallengeMode() {
    document.getElementById('challengeOverlay').style.display = 'none';
}

function showChallengeList() {
    document.getElementById('challengeList').style.display = 'grid';
    document.getElementById('challengeActive').style.display = 'none';
    
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    const viewed = JSON.parse(localStorage.getItem('viewedChallengeSolutions') || '[]');
    const list = document.getElementById('challengeList');
    list.innerHTML = '';
    
    CHALLENGES.forEach((ch, i) => {
        const done = completed.includes(ch.id);
        const attendedOnly = !done && viewed.includes(ch.id);

        let statusClass = 'pending';
        let statusText = '? Not attempted';
        let cardClass = '';

        if (done) {
            statusClass = 'done';
            statusText = '? Completed';
            cardClass = ' completed';
        } else if (attendedOnly) {
            statusClass = 'attended';
            statusText = '?? Solution viewed';
            cardClass = ' attended';
        }

        const item = document.createElement('div');
        item.className = 'challenge-item' + cardClass;
        item.innerHTML = `
            <div class="challenge-item-number">#${i + 1}</div>
            <div class="challenge-item-title">${ch.title}</div>
            <div class="challenge-item-status ${statusClass}">${statusText}</div>
        `;
        item.onclick = () => startChallenge(i);
        list.appendChild(item);
    });

    const attendedOnlyCount = viewed.filter(id => !completed.includes(id)).length;
    const summary = completed.length + '/' + CHALLENGES.length + ' completed' +
        (attendedOnlyCount > 0 ? ' � ' + attendedOnlyCount + ' attended' : '');
    document.getElementById('challengeProgress').textContent = summary;
}

function startChallenge(index) {
    currentChallenge = CHALLENGES[index];
    challengeHintIndex = 0;
    
    document.getElementById('challengeList').style.display = 'none';
    document.getElementById('challengeActive').style.display = 'block';
    document.getElementById('challengeNumber').textContent = '#' + (index + 1);
    document.getElementById('challengeTitle').textContent = currentChallenge.title;
    document.getElementById('challengeTask').textContent = currentChallenge.task;
    document.getElementById('challengeFeedback').style.display = 'none';
    document.getElementById('challengeOutput').style.display = 'none';
    
    const editorEl = document.getElementById('challengeEditor');

    // If the user has already viewed the official solution for this challenge,
    // load the solution and lock the editor permanently. They cannot retry.
    const viewedSolutions = JSON.parse(localStorage.getItem('viewedChallengeSolutions') || '[]');
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');

    if (viewedSolutions.includes(currentChallenge.id)) {
        editorEl.value = currentChallenge.solution;
        lockChallengeEditor(true);
        const completedByPass = completed.includes(currentChallenge.id);
        showChallengeLockedNotice(completedByPass);
    } else {
        editorEl.value = '# Challenge: ' + currentChallenge.title + '\n# Write your solution below\n\n';
        lockChallengeEditor(false);
    }
}

function lockChallengeEditor(locked) {
    const editorEl = document.getElementById('challengeEditor');
    const submitBtn = document.querySelector('.challenge-submit');
    const solutionBtn = document.querySelector('.challenge-solution-btn');
    const hintBtn = document.querySelector('.challenge-hint-btn');

    if (locked) {
        editorEl.setAttribute('readonly', 'readonly');
        editorEl.classList.add('locked');
        if (submitBtn) submitBtn.disabled = true;
        if (solutionBtn) solutionBtn.disabled = true;
        if (hintBtn) hintBtn.disabled = true;
    } else {
        editorEl.removeAttribute('readonly');
        editorEl.classList.remove('locked');
        if (submitBtn) submitBtn.disabled = false;
        if (solutionBtn) solutionBtn.disabled = false;
        if (hintBtn) hintBtn.disabled = false;
    }
}

function showChallengeLockedNotice(completedByPass) {
    const feedback = document.getElementById('challengeFeedback');
    feedback.style.display = 'block';
    feedback.className = 'challenge-feedback locked';
    if (completedByPass) {
        feedback.innerHTML = '?? <strong>Challenge complete.</strong> The official solution is shown for reference. Editor is locked.';
    } else {
        feedback.innerHTML = '?? <strong>Solution viewed � challenge attended (no XP).</strong> The official solution is shown for reference. Editor is locked and this challenge cannot be retried.';
    }
}

async function runAndSubmitChallenge() {
    if (!currentChallenge) return;
    
    const code = document.getElementById('challengeEditor').value;
    const outputEl = document.getElementById('challengeOutput');
    const outputText = document.getElementById('challengeOutputText');
    const feedback = document.getElementById('challengeFeedback');
    
    // Run the code first
    outputEl.style.display = 'block';
    outputText.textContent = 'Running...\n';
    
    try {
        let output = '';
        pyodide.setStdout({ batched: (msg) => { output += msg + '\n'; } });
        await pyodide.runPythonAsync(code);
        outputText.textContent = output || '(no output)';
    } catch (error) {
        outputText.textContent = '? Error:\n' + error.message;
    }
    
    // Now evaluate with AI
    feedback.style.display = 'block';
    feedback.className = 'challenge-feedback';
    feedback.innerHTML = '<span class="typing-dots"><span>?</span><span>?</span><span>?</span></span> AI is evaluating...';
    
    const evalPrompt = `You are evaluating a beginner Python student's code.

CHALLENGE: ${currentChallenge.title}
TASK: ${currentChallenge.task}
REQUIREMENTS: ${currentChallenge.requirements.join(', ')}

CODE:
\`\`\`python
${code}
\`\`\`

OUTPUT: ${outputText.textContent}

Be very encouraging. Respond:
VERDICT: PASS or NEEDS_WORK
? What's correct
? What's missing (only if NEEDS_WORK)
?? One tip
?? Encouragement`;

    // Pass a callback so we can mark the challenge complete the moment AI says PASS,
    // instead of racing against a setTimeout.
    const challengeId = currentChallenge.id;
    callAIForLab(evalPrompt, feedback, (passed) => {
        if (passed) markChallengeComplete(challengeId);
    });
}

function markChallengeComplete(challengeId) {
    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    if (completed.includes(challengeId)) return;
    completed.push(challengeId);
    localStorage.setItem('completedChallenges', JSON.stringify(completed));
    addXP(30, 'Challenge completed');
    showToast('?? Challenge completed! +30 XP');

    const progressLabel = document.getElementById('challengeProgress');
    if (progressLabel) progressLabel.textContent = completed.length + '/' + CHALLENGES.length + ' completed';

    // Push to cloud immediately (skip debounce)
    if (currentUser && !currentUser.isGuest && window.fbHelpers) {
        const progress = getProgress();
        window.fbHelpers.saveUser(currentUser.uid, {
            xp: progress.xp,
            completedChallenges: completed,
            level: getLevelInfo(progress.xp).level
        }).catch(() => {});
    }
}

function showChallengeHint() {
    if (!currentChallenge) return;
    const feedback = document.getElementById('challengeFeedback');
    feedback.style.display = 'block';
    feedback.className = 'challenge-feedback';
    
    if (challengeHintIndex < currentChallenge.hints.length) {
        feedback.innerHTML = '?? <strong>Hint ' + (challengeHintIndex + 1) + ':</strong> ' + currentChallenge.hints[challengeHintIndex];
        challengeHintIndex++;
    } else {
        feedback.innerHTML = '?? No more hints available. Try the solution button!';
    }
}

function showChallengeSolution() {
    if (!currentChallenge) return;

    const completed = JSON.parse(localStorage.getItem('completedChallenges') || '[]');
    const isAlreadyCompleted = completed.includes(currentChallenge.id);
    const feedback = document.getElementById('challengeFeedback');

    // Confirm before revealing � viewing the solution permanently locks the editor.
    let confirmMsg;
    if (isAlreadyCompleted) {
        confirmMsg = 'You\u2019ve already completed this challenge. Viewing the official solution will lock the editor for reference.\n\nProceed?';
    } else {
        confirmMsg =
            'Heads up: viewing the official solution will mark this challenge as ATTENDED (not completed) ' +
            'and you will NOT earn XP for it. The editor will be locked and you cannot retry this challenge.\n\n' +
            'Do you want to give up and see the solution?';
    }

    if (!confirm(confirmMsg)) {
        return;
    }

    // Load solution + record that the user has viewed it (locally and in the cloud).
    document.getElementById('challengeEditor').value = currentChallenge.solution;

    const viewed = JSON.parse(localStorage.getItem('viewedChallengeSolutions') || '[]');
    if (!viewed.includes(currentChallenge.id)) {
        viewed.push(currentChallenge.id);
        localStorage.setItem('viewedChallengeSolutions', JSON.stringify(viewed));
        // Sync to Firebase immediately
        if (currentUser && !currentUser.isGuest && window.fbHelpers) {
            window.fbHelpers.saveUser(currentUser.uid, {
                viewedChallengeSolutions: viewed
            }).catch(() => {});
        }
    }

    lockChallengeEditor(true);
    feedback.style.display = 'block';
    feedback.className = 'challenge-feedback locked';

    if (isAlreadyCompleted) {
        feedback.innerHTML = '?? <strong>Official solution shown above.</strong> Editor is locked.';
    } else {
        feedback.innerHTML = '?? <strong>Solution shown � challenge attended (no XP awarded).</strong> Editor is locked. This challenge cannot be retried.';
        showToast('?? Challenge attended � no XP earned');
    }

    // Refresh challenge list summary so the badge shows up
    const progressLabel = document.getElementById('challengeProgress');
    if (progressLabel) {
        const total = CHALLENGES.length;
        const completedCount = completed.length;
        const attendedOnly = viewed.filter(id => !completed.includes(id)).length;
        progressLabel.textContent = completedCount + '/' + total + ' completed' +
            (attendedOnly > 0 ? ' � ' + attendedOnly + ' attended' : '');
    }
}

// ===== END CHALLENGE MODE =====

// ===== LEADERBOARD =====

function openLeaderboard() {
    const overlay = document.getElementById('leaderboardOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    renderLeaderboard();

    if (window.fbHelpers) {
        // Tear down any old subscription before creating a new one
        if (leaderboardUnsubscribe) { try { leaderboardUnsubscribe(); } catch(e){} }
        leaderboardUnsubscribe = window.fbHelpers.subscribeLeaderboard(50, (users) => {
            renderLeaderboardList(users);
        });
    } else {
        document.getElementById('leaderboardList').innerHTML =
            '<div class="leaderboard-empty">Leaderboard requires sign-in. Please sign in to participate.</div>';
    }
}

function closeLeaderboard() {
    const overlay = document.getElementById('leaderboardOverlay');
    if (overlay) overlay.style.display = 'none';
    if (leaderboardUnsubscribe) {
        try { leaderboardUnsubscribe(); } catch(e){}
        leaderboardUnsubscribe = null;
    }
}

function renderLeaderboard() {
    document.getElementById('leaderboardList').innerHTML = '<div class="leaderboard-loading">Loading�</div>';
    document.getElementById('leaderboardFooter').textContent = '';
}

function renderLeaderboardList(users) {
    const list = document.getElementById('leaderboardList');
    const footer = document.getElementById('leaderboardFooter');

    if (!users || users.length === 0) {
        list.innerHTML = '<div class="leaderboard-empty">No participants yet � be the first!</div>';
        return;
    }

    // Filter to this course only (in case other courses share the DB)
    const courseUsers = users.filter(u => !u.course || u.course === window.fbHelpers.COURSE_ID);

    let html = '<div class="leaderboard-row leaderboard-head"><span>#</span><span>Learner</span><span>Level</span><span>XP</span><span>Badges</span></div>';
    courseUsers.forEach((u, i) => {
        const rank = i + 1;
        const isMe = currentUser && u.uid === currentUser.uid;
        const medal = rank === 1 ? '??' : rank === 2 ? '??' : rank === 3 ? '??' : '#' + rank;
        const name = (u.displayName || 'Anonymous').replace(/[<>]/g, '');
        html += `<div class="leaderboard-row${isMe ? ' me' : ''}">
            <span class="lb-rank">${medal}</span>
            <span class="lb-name">${name}${isMe ? ' <em>(you)</em>' : ''}</span>
            <span class="lb-level">Lv.${u.level || 1}</span>
            <span class="lb-xp">${u.xp || 0} XP</span>
            <span class="lb-badges">?? ${(u.badges || []).length}</span>
        </div>`;
    });

    list.innerHTML = html;

    // Show user's rank in footer
    if (currentUser) {
        const myIndex = courseUsers.findIndex(u => u.uid === currentUser.uid);
        if (myIndex >= 0) {
            footer.textContent = `You are ranked #${myIndex + 1} of ${courseUsers.length}`;
        } else {
            footer.textContent = `${courseUsers.length} learners on the board`;
        }
    }
}

// ===== END LEADERBOARD =====

// ===== Reset my progress (self-service cache + cloud reset for the current course) =====

async function resetMyProgress() {
    const courseId = (window.fbHelpers && window.fbHelpers.COURSE_ID) || 'this course';
    const ok = confirm(
        `Reset all your progress for ${courseId}?\n\n` +
        `This will:\n` +
        `  � Clear cached XP, badges, completed sections and challenges (this device)\n` +
        `  � Zero your progress on the cloud (all your devices)\n` +
        `  � Keep your sign-in account and your work on OTHER courses intact\n\n` +
        `This cannot be undone. Continue?`
    );
    if (!ok) return;

    // 1. Wipe per-course localStorage
    try {
        const progressKey = getProgressKey();
        localStorage.removeItem(progressKey);
        localStorage.removeItem('completedChallenges');
        localStorage.removeItem('viewedChallengeSolutions');
        localStorage.removeItem(STORAGE_KEYS.lastSession);
        // Drop editor + chat caches for this course
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const k = localStorage.key(i);
            if (!k) continue;
            if (k.startsWith(STORAGE_KEYS.editorPrefix) || k.startsWith(STORAGE_KEYS.chatPrefix)) {
                localStorage.removeItem(k);
            }
        }
        // Old non-namespaced key, if still around
        localStorage.removeItem('pythonLabProgress');
    } catch (e) { console.warn('Local clear failed:', e); }

    // 2. Zero the cloud
    if (currentUser && !currentUser.isGuest && window.fbHelpers && window.fbHelpers.resetUserProgress) {
        try {
            await window.fbHelpers.resetUserProgress(currentUser.uid, window.fbHelpers.COURSE_ID);
        } catch (e) {
            console.warn('Cloud reset failed:', e);
            alert('Cloud reset failed � your local cache is cleared, but please tell your instructor if your XP keeps showing the old value.');
        }
    }

    // 3. Reload so all in-memory state goes with it
    location.reload();
}

// ===== Fullscreen =====

function toggleStudentFullscreen() {
    const btn = document.querySelector('.fullscreen-btn');
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().then(() => {
            if (btn) btn.innerHTML = '? Exit';
        }).catch((err) => {
            console.warn('Fullscreen request failed:', err);
        });
    } else {
        document.exitFullscreen().then(() => {
            if (btn) btn.innerHTML = '? Fullscreen';
        }).catch(() => {});
    }
}

// Keep button label in sync if user presses Esc / F11
document.addEventListener('fullscreenchange', () => {
    const btn = document.querySelector('.fullscreen-btn');
    if (!btn) return;
    btn.innerHTML = document.fullscreenElement ? '? Exit' : '? Fullscreen';
});

// ===== Keyboard Navigation =====
// Right arrow reveals/advances, left arrow goes back
document.addEventListener("keydown", function(e) {
    // Don't intercept if user is typing in editor, textarea, or chat input
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.target.classList.contains("CodeMirror")) return;
    if (document.querySelector(".CodeMirror-focused")) return;

    if (e.key === "ArrowRight") {
        e.preventDefault();
        nextSection();
    } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        previousSection();
    } else if (e.key === "f" || e.key === "F") {
        // Toggle fullscreen
        e.preventDefault();
        toggleStudentFullscreen();
    }
});

window.onload = initializeApp;


// ===== Entitlement lock card =====

function renderLockedSection() {
    const module = courseData.modules[currentModule];
    const labObj = document.getElementById('labObjectiveCard');
    if (labObj) labObj.style.display = 'none';
    const desc = document.getElementById('description');
    if (desc) desc.innerHTML = '';
    const diagram = document.querySelector('.diagram-box');
    if (diagram) diagram.innerHTML = '';
    const heading = document.getElementById('sectionHeading');
    if (heading) heading.textContent = '';

    const left = document.getElementById('leftPanel');
    let card = document.getElementById('lockedCard');
    if (!card) {
        card = document.createElement('div');
        card.id = 'lockedCard';
        card.className = 'locked-card';
        if (left) left.insertBefore(card, left.firstChild);
    }
    card.style.display = 'block';
    card.innerHTML = `
        <div class="locked-card-icon">??</div>
        <div class="locked-card-title">${escapeHtml(module.title)} is part of the paid course</div>
        <p class="locked-card-text">
            Modules 1�${PREVIEW_MODULE_LIMIT} are free for everyone. To unlock the rest � including
            the AI Lab Mentor for advanced modules, hands-on challenges, and the live leaderboard �
            enrol on PowerShell Academy.
        </p>
        <div class="locked-card-actions">
            <a href="${ENROLL_URL}" target="_blank" class="locked-card-cta">?? Enrol on PowerShell Academy</a>
            <button class="locked-card-secondary" onclick="goToFirstUnlockedModule()">? Back to free modules</button>
        </div>
        <p class="locked-card-tip">
            ?? <strong>Important:</strong> when you enrol, use the
            <strong>same email</strong> you signed in with here (<code>${escapeHtml((currentUser && currentUser.email) || 'your-email@example.com')}</code>).
            That's how the lab automatically unlocks for you.
            <br><br>
            Already enrolled? Once your purchase is processed (usually within seconds),
            this page will unlock automatically. You can also click
            <a href="#" onclick="recheckEntitlement(); return false;">refresh access</a>.
        </p>
    `;

    const rightPanel = document.getElementById('rightPanel');
    const toggleBtn  = document.getElementById('panelToggle');
    if (rightPanel && rightPanel.classList.contains('open') && typeof toggleRightPanel === 'function') toggleRightPanel();
    if (toggleBtn) toggleBtn.classList.remove('has-code');

    const breadcrumb = document.getElementById('breadcrumb');
    if (breadcrumb) breadcrumb.textContent = module.title + ' > ?? Locked';
    const totalInModule = module.sections.length;
    const indicator = document.getElementById('sectionIndicator');
    if (indicator) indicator.textContent = (currentSection + 1) + ' / ' + totalInModule;
}

function goToFirstUnlockedModule() {
    currentModule  = Math.min(PREVIEW_MODULE_LIMIT - 1, courseData.modules.length - 1);
    currentSection = 0;
    if (typeof loadSections === 'function') loadSections(); else renderSection();
}

async function recheckEntitlement() {
    if (!currentUser || !window.fbHelpers || !window.fbHelpers.loadEntitlement) {
        showToast('Sign in to refresh your access.');
        return;
    }
    showToast('Checking access�');
    try {
        await claimPendingViaWorker(currentUser.uid, currentUser.email || "");
        currentEntitlement = await window.fbHelpers.loadEntitlement(currentUser.uid);
        if (hasFullAccess()) {
            showToast('?? Access granted!');
            renderSection();
        } else {
            showToast('No active entitlement found yet. Try again in a moment.');
        }
    } catch (e) {
        showToast('Could not check access � please refresh the page.');
    }
}

if (typeof escapeHtml !== 'function') {
    function escapeHtml(s) {
        return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
}
