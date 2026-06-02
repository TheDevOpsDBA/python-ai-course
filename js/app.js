let editor;
let pyodide;

let currentModule = 0;
let currentSection = 0;
let lastRenderedModule = -1;

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
    { id: "first-steps", name: "First Steps", icon: "👣", desc: "Complete your first section" },
    { id: "first-run", name: "First Run", icon: "▶️", desc: "Run code for the first time" },
    { id: "python-beginner", name: "Python Beginner", icon: "🐍", desc: "Complete Python Basics module" },
    { id: "collection-master", name: "Collection Master", icon: "📦", desc: "Complete Collections module" },
    { id: "flow-controller", name: "Flow Controller", icon: "🔀", desc: "Complete Control Flow module" },
    { id: "function-builder", name: "Function Builder", icon: "⚙️", desc: "Complete Functions module" },
    { id: "error-handler", name: "Error Handler", icon: "🛡️", desc: "Complete Error Handling module" },
    { id: "ai-explorer", name: "AI Explorer", icon: "🤖", desc: "Complete AI & ML module" },
    { id: "lab-rat", name: "Lab Rat", icon: "🧪", desc: "Complete 5 lab challenges" },
    { id: "streak-hero", name: "Streak Hero", icon: "🔥", desc: "Maintain a 7-day streak" },
    { id: "code-runner", name: "Code Runner", icon: "🏃", desc: "Run code 50 times" },
    { id: "champion", name: "Course Champion", icon: "🏆", desc: "Complete all modules" }
];

function getProgress() {
    const defaults = {
        xp: 0, level: 1, streak: { current: 0, lastDate: "", best: 0 },
        completedSections: [], completedModules: [], codeRuns: 0,
        labsCompleted: 0, aiQuestions: 0, badges: [], firstVisit: new Date().toISOString().split('T')[0]
    };
    try {
        const saved = localStorage.getItem("pythonLabProgress");
        if (saved) return { ...defaults, ...JSON.parse(saved) };
    } catch (e) {}
    return defaults;
}

function saveProgress(progress) {
    localStorage.setItem("pythonLabProgress", JSON.stringify(progress));
}

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
    document.getElementById("streakDisplay").textContent = "🔥" + progress.streak.current;
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
    document.getElementById("levelupText").textContent = "⬆️ Level " + levelInfo.level + " — " + levelInfo.title + "!";
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
    progress.codeRuns += 1;
    saveProgress(progress);

    if (progress.codeRuns === 1) awardBadge("first-run");
    checkModuleBadges();
    addXP(10, "Run code");
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

    editor = CodeMirror.fromTextArea(
        editorEl,
        {
            mode: "python",
            theme: "material-darker",
            lineNumbers: true
        }
    );

    pyodide = await loadPyodide();

    loadModules();
    updateGamificationUI();
    updateProgress();
}

function loadModules() {

    const moduleSelect = document.getElementById("moduleSelect");
    moduleSelect.innerHTML = "";

    courseData.modules.forEach((module, index) => {

        const option = document.createElement("option");

        option.value = index;
        option.textContent = module.title;

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
        const mark = completed.includes(section.id) ? '✓ ' : '○ ';
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

    // Show lab objective card when entering a new module
    const card = document.getElementById('labObjectiveCard');
    const module = courseData.modules[currentModule];
    if (currentModule !== lastRenderedModule && module.labObjective) {
        lastRenderedModule = currentModule;
        const obj = module.labObjective;
        document.getElementById('labObjText').textContent = obj.objective;
        document.getElementById('labObjTime').textContent = '⏱ ' + obj.duration;

        const diffEl = document.getElementById('labObjDifficulty');
        diffEl.textContent = '🧠 ' + obj.difficulty;
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
        document.getElementById('fileBadge').textContent = '📄 ' + section.examples[0].name + '.py';
    } else {
        document.getElementById('fileBadge').textContent = '📄 scratch.py';
    }

    // Update line count
    setTimeout(() => {
        if (editor) document.getElementById('lineCount').textContent = 'Lines: ' + editor.lineCount();
    }, 100);

    // Show/hide lab section
    const labSection = document.getElementById('labSection');
    if (section.lab) {
        labSection.style.display = 'block';
        document.getElementById('labChallenge').textContent = section.lab.challenge;
        document.getElementById('labHint').textContent = '💡 Hint: ' + section.lab.hint;
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

    scratchButton.innerText = "✏ Scratch Pad";
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
        output.textContent = "⚠ No code selected. Highlight lines to run them.";
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
        showToast('📋 Code copied to clipboard!');
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

        showToast('🎉 Module Complete!');
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
    document.getElementById('progressBar').style.setProperty('--progress', pct + '%');
    document.getElementById('progressText').textContent = pct + '%';
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

function addChatMessage(text, role) {
    const messages = document.getElementById("chatMessages");
    const msg = document.createElement("div");
    msg.className = `chat-msg ${role}`;
    msg.innerHTML = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
    return msg;
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

    const loadingMsg = addChatMessage('<span class="typing-dots"><span>●</span><span>●</span><span>●</span></span>', "bot loading");

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
                    answer = answer
                        .replace(/\n\n/g, "<br><br>")
                        .replace(/\n/g, "<br>")
                        .replace(/`([^`]+)`/g, "<code>$1</code>")
                        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
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

function evaluateLab() {
    const section = courseData.modules[currentModule].sections[currentSection];
    if (!section.lab) return;

    // Open the right panel if closed
    const panel = document.getElementById('rightPanel');
    if (!panel.classList.contains('open')) toggleRightPanel();

    // Set chat input with evaluation request
    const code = editor ? editor.getValue() : "";
    const evalPrompt = `Evaluate my solution for this lab challenge: "${section.lab.challenge}"\n\nHere is my code:\n\`\`\`python\n${code}\n\`\`\`\n\nGive feedback: Does it meet the requirements? Any improvements? Rate it: Beginner/Good/Excellent.`;

    document.getElementById('chatInput').value = evalPrompt;
    sendChat();
    trackLabComplete();
}

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
    }
});

window.onload = initializeApp;
