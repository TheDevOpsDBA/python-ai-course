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
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid",
        ".validate": "newData.hasChildren(['uid', 'displayName', 'xp'])",
        "uid":               { ".validate": "newData.val() === $uid" },
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
