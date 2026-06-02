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
    query,
    orderByChild,
    limitToLast,
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

    // Real-time leaderboard subscription — top N users by XP
    subscribeLeaderboard: (limit, cb) => {
        const q = query(ref(db, "users"), orderByChild("xp"), limitToLast(limit));
        return onValue(q, (snap) => {
            const list = [];
            snap.forEach((child) => list.push(child.val()));
            list.sort((a, b) => (b.xp || 0) - (a.xp || 0));
            cb(list);
        });
    }
};

// Notify app.js that Firebase is ready
window.dispatchEvent(new Event("firebase-ready"));
