// Firebase Initialization & Auth/DB Helpers
// Exposes window.fbAuth, window.fbDB, window.fbHelpers for app.js to consume.
//
// Schema (per course isolation):
//   users/{uid}/
//     displayName, email, photoURL, createdAt, lastSeen   (shared identity)
//     courses/{courseId}/
//       xp, level, badges[], completedSections[], completedChallenges[],
//       viewedChallengeSolutions[], codeRuns, labsCompleted,
//       lastSession, editorState/{sectionId}, chatHistory/{sectionId}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getAuth,
    setPersistence,
    inMemoryPersistence,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously,
    signOut,
    signInWithCustomToken,
    updateProfile
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    get,
    update,
    onValue,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD19BvrNw2IMiAL6DgCR2i0S4FUP2l5Wqg",
    authDomain: "powershell-academy-labs.firebaseapp.com",
    databaseURL: "https://powershell-academy-labs-default-rtdb.firebaseio.com",
    projectId: "powershell-academy-labs",
    storageBucket: "powershell-academy-labs.firebasestorage.app",
    messagingSenderId: "10190954711",
    appId: "1:10190954711:web:ad15f36f38dbcf7c639092",
    measurementId: "G-8TYWHQRQ80"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

setPersistence(auth, inMemoryPersistence).catch((err) => {
    console.warn("setPersistence failed:", err);
});

// Course identifier — overridden per deploy
const COURSE_ID = "python-for-ai";

// Path helpers
const userRoot   = (uid) => `users/${uid}`;
const courseRoot = (uid) => `users/${uid}/courses/${COURSE_ID}`;

// Identity-only fields (live at user root, shared across courses)
const IDENTITY_FIELDS = ["displayName", "email", "photoURL", "createdAt", "lastSeen"];
// Progress fields (live under the course bucket)
const PROGRESS_FIELDS = [
    "xp", "level", "badges", "completedSections", "completedChallenges",
    "viewedChallengeSolutions", "codeRuns", "labsCompleted", "course"
];

window.fbAuth = auth;
window.fbDB = db;
window.fbHelpers = {
    COURSE_ID,
    onAuthStateChanged: (cb) => onAuthStateChanged(auth, cb),
    signInEmail:   (email, pwd) => signInWithEmailAndPassword(auth, email, pwd),
    signUpEmail:   async (email, pwd, displayName) => {
        const cred = await createUserWithEmailAndPassword(auth, email, pwd);
        if (displayName) await updateProfile(cred.user, { displayName });
        return cred;
    },
    signInGoogle:    () => signInWithPopup(auth, new GoogleAuthProvider()),
    signInAnonymous: () => signInAnonymously(auth),
    signOut:         () => signOut(auth),
    signInWithCustomToken: (token) => signInWithCustomToken(auth, token),
    updateName: (displayName) => updateProfile(auth.currentUser, { displayName }),
    sendPasswordReset: (email) => sendPasswordResetEmail(auth, email),

    // Load merged identity + this course's progress
    loadUser: async (uid) => {
        const [idSnap, courseSnap] = await Promise.all([
            get(ref(db, userRoot(uid))),
            get(ref(db, courseRoot(uid)))
        ]);
        if (!idSnap.exists() && !courseSnap.exists()) return null;

        // Shape the result so existing app code keeps working.
        const identity = idSnap.exists() ? idSnap.val() : {};
        const courseData = courseSnap.exists() ? courseSnap.val() : {};

        // Strip nested children that already exist on identity
        const merged = {
            uid,
            displayName: identity.displayName || courseData.displayName || "",
            email:       identity.email || "",
            photoURL:    identity.photoURL || "",
            createdAt:   identity.createdAt,
            lastSeen:    identity.lastSeen,
            ...courseData                               // course-specific progress
        };
        return merged;
    },

    // Split incoming partial save into identity vs course-progress writes.
    // Callers can keep passing a flat object — we route the fields correctly.
    saveUser: (uid, data) => {
        const idPatch = { lastSeen: serverTimestamp() };
        const coursePatch = {};

        Object.keys(data || {}).forEach((k) => {
            if (IDENTITY_FIELDS.includes(k)) {
                idPatch[k] = data[k];
            } else if (PROGRESS_FIELDS.includes(k)) {
                coursePatch[k] = data[k];
            } else {
                // Unknown field — default to course bucket so progress stays scoped
                coursePatch[k] = data[k];
            }
        });

        const writes = [update(ref(db, userRoot(uid)), idPatch)];
        if (Object.keys(coursePatch).length > 0) {
            coursePatch.course = COURSE_ID; // tag every write
            writes.push(update(ref(db, courseRoot(uid)), coursePatch));
        }
        return Promise.all(writes);
    },

    // Initialize identity + this course's empty progress
    initUser: async (uid, profile) => {
        // Identity (only writes if not already there)
        await update(ref(db, userRoot(uid)), {
            uid,
            email:       profile.email || "",
            displayName: profile.displayName || "Student",
            photoURL:    profile.photoURL || "",
            createdAt:   serverTimestamp(),
            lastSeen:    serverTimestamp()
        });
        // Course-specific blank progress
        await set(ref(db, courseRoot(uid)), {
            course: COURSE_ID,
            xp: 0,
            level: 1,
            badges: [],
            completedSections: [],
            completedChallenges: [],
            viewedChallengeSolutions: [],
            codeRuns: 0,
            labsCompleted: 0,
            createdAt: serverTimestamp()
        });
    },

    // One-time migration: if a user has legacy top-level progress fields
    // (xp, badges, etc. directly on /users/{uid}), move them into
    // /users/{uid}/courses/{courseId}/ so each course is isolated.
    migrateLegacyProgress: async (uid) => {
        const snap = await get(ref(db, userRoot(uid)));
        if (!snap.exists()) return false;
        const root = snap.val();
        const hasLegacy = PROGRESS_FIELDS.some((f) => root[f] !== undefined);
        if (!hasLegacy) return false;

        // Has legacy data. Assume it belongs to whichever course matches `root.course`,
        // OR if absent, pick the current course.
        const targetCourse = (root.course && typeof root.course === 'string') ? root.course : COURSE_ID;
        const targetPath = `users/${uid}/courses/${targetCourse}`;

        const legacy = {};
        PROGRESS_FIELDS.forEach((f) => {
            if (root[f] !== undefined) legacy[f] = root[f];
        });
        // Preserve session/editor/chat where they previously lived
        if (root.lastSession)  legacy.lastSession  = root.lastSession;
        if (root.editorState)  legacy.editorState  = root.editorState;
        if (root.chatHistory)  legacy.chatHistory  = root.chatHistory;

        // Merge into the course bucket (don't blow away anything that's already there)
        const courseSnap = await get(ref(db, targetPath));
        const existing = courseSnap.exists() ? courseSnap.val() : {};
        await set(ref(db, targetPath), { ...existing, ...legacy });

        // Wipe the legacy top-level fields
        const cleanup = {};
        PROGRESS_FIELDS.forEach((f) => { if (root[f] !== undefined) cleanup[f] = null; });
        if (root.lastSession)  cleanup.lastSession  = null;
        if (root.editorState)  cleanup.editorState  = null;
        if (root.chatHistory)  cleanup.chatHistory  = null;
        await update(ref(db, userRoot(uid)), cleanup);

        console.info(`Migrated legacy progress to /courses/${targetCourse} for uid ${uid}`);
        return true;
    },

    // Real-time leaderboard subscription — only this course's students
    subscribeLeaderboard: (limit, cb) => {
        return onValue(ref(db, "users"), (snap) => {
            const list = [];
            snap.forEach((child) => {
                const u = child.val() || {};
                const courseProgress = u.courses && u.courses[COURSE_ID];
                if (!courseProgress) return; // user hasn't engaged with this course yet
                list.push({
                    uid: child.key,
                    displayName: u.displayName || (u.email ? u.email.split('@')[0] : 'Anonymous'),
                    xp:    typeof courseProgress.xp === 'number' ? courseProgress.xp : 0,
                    level: courseProgress.level || 1,
                    badges: courseProgress.badges || [],
                    course: COURSE_ID
                });
            });
            list.sort((a, b) => b.xp - a.xp);
            cb(list.slice(0, limit));
        }, (err) => {
            console.error("Leaderboard read failed:", err);
            cb([]);
        });
    },

    // ===== ADMIN =====
    isAdmin: async (uid) => {
        try {
            const snap = await get(ref(db, `admins/${uid}`));
            return snap.exists() && (snap.val() === true || snap.val() === 'true' || snap.val() === 1);
        } catch (e) {
            console.warn("isAdmin check failed:", e && e.message);
            return false;
        }
    },

    // List every user record. For each user, return one entry per course
    // they have progress in, plus identity info. This lets the admin UI filter
    // by course while still showing every record.
    listAllUsers: async () => {
        const snap = await get(ref(db, "users"));
        if (!snap.exists()) return [];
        const list = [];
        snap.forEach((child) => {
            const u = child.val() || {};
            const identity = {
                uid: child.key,
                displayName: u.displayName || "",
                email:       u.email || "",
                photoURL:    u.photoURL || "",
                createdAt:   u.createdAt,
                lastSeen:    u.lastSeen
            };
            const courses = u.courses || {};
            const courseIds = Object.keys(courses);

            if (courseIds.length === 0) {
                // Identity-only — user signed in but never produced course progress
                list.push({
                    ...identity,
                    course: "(none)",
                    xp: 0,
                    level: 1,
                    badges: [],
                    completedSections: [],
                    completedChallenges: [],
                    viewedChallengeSolutions: [],
                    codeRuns: 0,
                    labsCompleted: 0
                });
                return;
            }
            courseIds.forEach((cid) => {
                const cp = courses[cid] || {};
                list.push({
                    ...identity,
                    course: cid,
                    xp: cp.xp || 0,
                    level: cp.level || 1,
                    badges: cp.badges || [],
                    completedSections: cp.completedSections || [],
                    completedChallenges: cp.completedChallenges || [],
                    viewedChallengeSolutions: cp.viewedChallengeSolutions || [],
                    codeRuns: cp.codeRuns || 0,
                    labsCompleted: cp.labsCompleted || 0
                });
            });
        });
        return list;
    },

    // Reset a user's progress for a specific course (defaults to current course)
    resetUserProgress: (uid, courseId) => {
        const cid = courseId || COURSE_ID;
        return set(ref(db, `users/${uid}/courses/${cid}`), {
            course: cid,
            xp: 0,
            level: 1,
            badges: [],
            completedSections: [],
            completedChallenges: [],
            viewedChallengeSolutions: [],
            codeRuns: 0,
            labsCompleted: 0,
            // Stamp the reset moment so clients can detect & honour the wipe
            resetAt: serverTimestamp()
        });
    },

    // Delete a user's progress for a specific course (defaults to current course)
    deleteUserRecord: (uid, courseId) => {
        const cid = courseId || COURSE_ID;
        return set(ref(db, `users/${uid}/courses/${cid}`), null);
    },

    getUser: async (uid) => {
        const [idSnap, courseSnap] = await Promise.all([
            get(ref(db, userRoot(uid))),
            get(ref(db, courseRoot(uid)))
        ]);
        if (!idSnap.exists() && !courseSnap.exists()) return null;
        return {
            ...(idSnap.exists() ? idSnap.val() : {}),
            ...(courseSnap.exists() ? courseSnap.val() : {})
        };
    },

    // ===== SESSION PERSISTENCE — scoped under the course bucket =====
    saveLastSession: (uid, payload) => {
        return update(ref(db, `${courseRoot(uid)}/lastSession`), {
            ...payload,
            updatedAt: serverTimestamp()
        });
    },

    saveEditorState: (uid, sectionId, code) => {
        return set(ref(db, `${courseRoot(uid)}/editorState/${sectionId}`), {
            code,
            updatedAt: serverTimestamp()
        });
    },

    saveChatHistory: (uid, sectionId, messages) => {
        return set(ref(db, `${courseRoot(uid)}/chatHistory/${sectionId}`), {
            messages,
            updatedAt: serverTimestamp()
        });
    },

    loadEditorAndChat: async (uid) => {
        const [edSnap, chatSnap] = await Promise.all([
            get(ref(db, `${courseRoot(uid)}/editorState`)),
            get(ref(db, `${courseRoot(uid)}/chatHistory`))
        ]);
        return {
            editorState: edSnap.exists() ? edSnap.val() : {},
            chatHistory: chatSnap.exists() ? chatSnap.val() : {}
        };
    },

    // ===== ENTITLEMENTS =====

    // Read the user's entitlement for the current course.
    // Returns { tier: "full" | "preview", source, courseName, grantedAt, expiresAt }
    loadEntitlement: async (uid) => {
        try {
            const snap = await get(ref(db, `users/${uid}/entitlements/${COURSE_ID}`));
            if (!snap.exists()) return null;
            return snap.val();
        } catch (e) {
            console.warn("loadEntitlement failed:", e && e.message);
            return null;
        }
    },

    // Subscribe to live entitlement changes (so a fresh purchase unlocks the lab
    // without the user having to refresh).
    subscribeEntitlement: (uid, cb) => {
        return onValue(ref(db, `users/${uid}/entitlements/${COURSE_ID}`), (snap) => {
            cb(snap.exists() ? snap.val() : null);
        });
    },

    // Look in pendingEntitlements/{sanitisedEmail}/{courseId} for a grant the
    // webhook stored before the user had signed in to the lab. If found, copy
    // it into users/{uid}/entitlements/{courseId} and clear the pending bucket.
    claimPendingEntitlement: async (uid, email) => {
        if (!email) return null;
        const safe = email.toLowerCase().replace(/[.#$\/\[\]]/g, "_");
        try {
            const snap = await get(ref(db, `pendingEntitlements/${safe}/${COURSE_ID}`));
            if (!snap.exists()) return null;
            const pending = snap.val();
            // Promote into the user's entitlement record
            await set(ref(db, `users/${uid}/entitlements/${COURSE_ID}`), {
                tier:       pending.tier || "full",
                source:     pending.source || "graphy",
                courseName: pending.courseName || "",
                grantedAt:  pending.grantedAt || Date.now(),
                expiresAt:  pending.expiresAt || null,
                claimedFromPending: true
            });
            // Clear the pending bucket so it doesn't get applied twice
            await set(ref(db, `pendingEntitlements/${safe}/${COURSE_ID}`), null);
            return pending;
        } catch (e) {
            console.warn("claimPendingEntitlement failed:", e && e.message);
            return null;
        }
    }
};

window.dispatchEvent(new Event("firebase-ready"));
