// Firebase Initialization & Auth/DB Helpers
// Exposes window.fbAuth, window.fbDB, window.fbHelpers for app.js to consume.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously,
    signOut,
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

// Course identifier — different courses share the same Firebase project
const COURSE_ID = "python-for-ai";

// Expose globally for non-module app.js
window.fbAuth = auth;
window.fbDB = db;
window.fbHelpers = {
    COURSE_ID,
    onAuthStateChanged: (cb) => onAuthStateChanged(auth, cb),
    signInEmail: (email, pwd) => signInWithEmailAndPassword(auth, email, pwd),
    signUpEmail: async (email, pwd, displayName) => {
        const cred = await createUserWithEmailAndPassword(auth, email, pwd);
        if (displayName) await updateProfile(cred.user, { displayName });
        return cred;
    },
    signInGoogle: () => signInWithPopup(auth, new GoogleAuthProvider()),
    signInAnonymous: () => signInAnonymously(auth),
    signOut: () => signOut(auth),
    updateName: (displayName) => updateProfile(auth.currentUser, { displayName }),

    // Load user record (returns null if not exists)
    loadUser: async (uid) => {
        const snap = await get(ref(db, `users/${uid}`));
        return snap.exists() ? snap.val() : null;
    },

    // Save / merge user record
    saveUser: (uid, data) => {
        return update(ref(db, `users/${uid}`), {
            ...data,
            lastSeen: serverTimestamp()
        });
    },

    // Initialize a new user record
    initUser: (uid, profile) => {
        return set(ref(db, `users/${uid}`), {
            uid,
            email: profile.email || "",
            displayName: profile.displayName || "Student",
            photoURL: profile.photoURL || "",
            course: COURSE_ID,
            xp: 0,
            level: 1,
            badges: [],
            completedSections: [],
            completedChallenges: [],
            codeRuns: 0,
            labsCompleted: 0,
            createdAt: serverTimestamp(),
            lastSeen: serverTimestamp()
        });
    },

    // Real-time leaderboard subscription.
    // We listen on the entire /users path (not orderByChild) so that records
    // missing/null xp still appear. Sort + slice happen client-side.
    subscribeLeaderboard: (limit, cb) => {
        return onValue(ref(db, "users"), (snap) => {
            const list = [];
            snap.forEach((child) => {
                const val = child.val() || {};
                // Ensure required fields have safe defaults
                list.push({
                    uid: val.uid || child.key,
                    displayName: val.displayName || (val.email ? val.email.split('@')[0] : 'Anonymous'),
                    xp: typeof val.xp === 'number' ? val.xp : 0,
                    level: val.level || 1,
                    badges: val.badges || [],
                    course: val.course || ''
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

    // Check whether the currently signed-in user is in /admins/{uid}
    isAdmin: async (uid) => {
        try {
            const snap = await get(ref(db, `admins/${uid}`));
            return snap.exists() && snap.val() === true;
        } catch (e) { return false; }
    },

    // List every user record (admin only — fails silently for non-admins)
    listAllUsers: async () => {
        const snap = await get(ref(db, "users"));
        if (!snap.exists()) return [];
        const list = [];
        snap.forEach((child) => {
            const v = child.val() || {};
            list.push({ uid: child.key, ...v });
        });
        return list;
    },

    // Reset a user's progress to zero — keeps their auth record + display name
    resetUserProgress: async (uid) => {
        return update(ref(db, `users/${uid}`), {
            xp: 0,
            level: 1,
            badges: [],
            completedSections: [],
            completedChallenges: [],
            viewedChallengeSolutions: [],
            codeRuns: 0,
            labsCompleted: 0
        });
    },

    // Delete a user's record entirely — removes them from leaderboard.
    // Note: their Firebase Auth account is NOT deleted by this (browser SDK
    // can't delete other users). Use the Firebase Console for that.
    deleteUserRecord: (uid) => {
        return set(ref(db, `users/${uid}`), null);
    },

    // Get a single user's full record
    getUser: async (uid) => {
        const snap = await get(ref(db, `users/${uid}`));
        return snap.exists() ? snap.val() : null;
    },

    // ===== SESSION PERSISTENCE =====

    // Save the user's "where they are" — last module/section
    saveLastSession: (uid, payload) => {
        return update(ref(db, `users/${uid}/lastSession`), {
            ...payload,
            updatedAt: serverTimestamp()
        });
    },

    // Save (or replace) the editor code for a single section
    saveEditorState: (uid, sectionId, code) => {
        return set(ref(db, `users/${uid}/editorState/${sectionId}`), {
            code,
            updatedAt: serverTimestamp()
        });
    },

    // Save chat history for a section (cap at N messages handled by caller)
    saveChatHistory: (uid, sectionId, messages) => {
        return set(ref(db, `users/${uid}/chatHistory/${sectionId}`), {
            messages,
            updatedAt: serverTimestamp()
        });
    },

    // Pull editor state + chat history during sign-in hydration
    loadEditorAndChat: async (uid) => {
        const [edSnap, chatSnap] = await Promise.all([
            get(ref(db, `users/${uid}/editorState`)),
            get(ref(db, `users/${uid}/chatHistory`))
        ]);
        return {
            editorState: edSnap.exists() ? edSnap.val() : {},
            chatHistory: chatSnap.exists() ? chatSnap.val() : {}
        };
    }
};

// Notify app.js that Firebase is ready
window.dispatchEvent(new Event("firebase-ready"));
