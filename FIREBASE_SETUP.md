# Firebase Setup — Required One-Time Steps

The login + leaderboard system uses Firebase project **powershell-academy-labs**.
Before deployment works, complete these one-time steps in the Firebase Console.

## 1. Enable Authentication providers

Open: <https://console.firebase.google.com/project/powershell-academy-labs/authentication/providers>

Enable:

- **Email/Password**
- **Google**
- **Anonymous** (for the "Continue as guest" option)

## 2. Create the Realtime Database

Open: <https://console.firebase.google.com/project/powershell-academy-labs/database>

- Click **Create Database**
- Region: pick closest (e.g. `us-central1`)
- Start in **locked mode** (we'll paste rules below)

## 3. Paste these security rules

In the Realtime Database **Rules** tab, paste:

```json
{
  "rules": {
    "admins": {
      ".read": "auth != null && root.child('admins').child(auth.uid).val() === true",
      "$uid": {
        ".write": "auth != null && root.child('admins').child(auth.uid).val() === true"
      }
    },
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && (auth.uid === $uid || root.child('admins').child(auth.uid).val() === true)",
        ".validate": "newData.hasChildren(['displayName']) || newData.val() === null",
        "uid":               { ".validate": "newData.isString()" },
        "displayName":       { ".validate": "newData.isString() && newData.val().length <= 50" },
        "email":             { ".validate": "newData.isString()" },
        "photoURL":          { ".validate": "newData.isString()" },
        "course":            { ".validate": "newData.isString()" },
        "xp":                { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 1000000" },
        "level":             { ".validate": "newData.isNumber()" },
        "badges":            { ".validate": "newData.hasChildren() || newData.val() === null" },
        "completedSections": { ".validate": "newData.hasChildren() || newData.val() === null" },
        "completedChallenges": { ".validate": "newData.hasChildren() || newData.val() === null" },
        "viewedChallengeSolutions": { ".validate": "newData.hasChildren() || newData.val() === null" },
        "codeRuns":          { ".validate": "newData.isNumber()" },
        "labsCompleted":     { ".validate": "newData.isNumber()" },
        "createdAt":         { ".validate": true },
        "lastSeen":          { ".validate": true },
        "lastSession":       { ".validate": true },
        "editorState":       { ".validate": true },
        "chatHistory":       { ".validate": true },
        "$other":            { ".validate": false }
      }
    }
  }
}
```

Rationale:

- Any signed-in user can **read** the leaderboard.
- Each user can only **write** their own `users/{uid}` node — no impersonation.
- XP is capped at 1,000,000 to make hand-tampering pointless.
- Display names limited to 50 chars to prevent UI griefing.
- Admins listed under `/admins/{uid} = true` can write to and delete any user record.

## 3a. Promote yourself to admin

After you sign in once via the student lab or presenter view, find your UID in the
[Authentication → Users](https://console.firebase.google.com/project/powershell-academy-labs/authentication/users)
tab.

Then in the Realtime Database, manually create:

```
/admins
   /<your-uid>: true
```

That's the gate the presenter "👥 Manage Users" button checks. Repeat for any
co-presenter or co-instructor.

## 4. Add authorized domains

Open: <https://console.firebase.google.com/project/powershell-academy-labs/authentication/settings>

Under **Authorized domains**, add:

- `pylabs.powershellacademy.com`
- `thedevopsdba.github.io`
- `localhost` (already there by default)

Without this, Google sign-in will fail on the production domain.

## How the app uses Firebase

- `js/firebase-init.js` is an **ES module** that loads Firebase v10 from the CDN. The `apiKey`
  in this file is **public** — that's by design with Firebase. Real security comes from
  the rules above plus the authorized-domains list.
- `js/app.js` waits for the `firebase-ready` event, then calls `onAuthStateChanged` to
  decide whether to show the login screen or the lab.
- Progress (XP, badges, completed sections/challenges) is debounced (1.5 s) and synced
  to `users/{uid}` after every save.
- The leaderboard subscribes to `users` ordered by `xp` (top 50) and updates live.


## Session persistence — what gets saved where

Below is the full data model the app writes per user.

```
/users/{uid}
  ├── displayName, email, photoURL, course      // identity
  ├── xp, level, badges                         // gamification
  ├── completedSections[]                       // section IDs
  ├── completedChallenges[]                     // challenge IDs (passed)
  ├── viewedChallengeSolutions[]                // challenge IDs (gave up)
  ├── codeRuns, labsCompleted                   // counters
  ├── createdAt, lastSeen                       // timestamps
  ├── lastSession                               // resume pointer
  │     ├── moduleIdx, sectionIdx
  │     ├── moduleId, sectionId
  │     └── updatedAt
  ├── editorState/{sectionId}                   // per-section code
  │     ├── code
  │     └── updatedAt
  └── chatHistory/{sectionId}                   // per-section AI chat
        ├── messages[] { role, text, ts }
        └── updatedAt
```

### Save cadence

| Field | Trigger | Local | Cloud |
|---|---|---|---|
| `xp`, `badges`, etc. | any progress event | instant | debounced 1.5 s |
| `lastSession` | section change | instant | debounced 0.8 s |
| `editorState/{sectionId}` | CodeMirror change (600 ms idle) | instant | debounced 2.0 s |
| `chatHistory/{sectionId}` | each new message | instant | debounced 2.5 s |

### Recovery flow

1. On sign-in, the client fetches `users/{uid}` and merges into localStorage.
2. It also pulls `editorState` and `chatHistory` so any section opens with the user's last code/conversation pre-loaded.
3. If `lastSession.updatedAt` is within 30 days and on a different position than where the user is now, a one-time "Welcome back" banner offers a one-click resume.
