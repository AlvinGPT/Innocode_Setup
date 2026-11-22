# 🛡️ InnoCode Strict Guardian: Official Proctoring & Telemetry Agent

> **CRITICAL SECURITY NOTICE:** This software is a mandatory, active proctoring and telemetry agent for all competition participants. Modifying source files, disabling Developer Mode, switching to an unmonitored browser/window for extended periods, or removing/reloading this extension during the competition triggers an immediate **`OFFLINE / TAMPERED`** alert on the proctor dashboard and constitutes a direct violation of competition rules.

## 📋 Overview
**InnoCode Strict Guardian** (v2.1) is a cloud-managed Manifest V3 browser agent designed to ensure a fair, transparent competition environment for the **InnoCode '26 School Hackathon** (Sharjah Indian School, Juwaiza). It enforces dynamic domain whitelisting, isolates telemetry across multi-room sessions, tracks active browser window focus, logs visited domains and installed extensions, captures periodic randomized screenshots, and provides real-time proctor lockout (`DENY`) and restoration (`ALLOW`) controls.

## ⚙️ Architecture & Features
* **Multi-Room Session Isolation:** Proctors create isolated competition rooms (e.g., `LAB-A`) directly from the dashboard. Each room generates its own dedicated folder hierarchy in Google Drive (`ROOT_FOLDER -> RoomCode -> DeviceName`), and participants must enter a valid proctor-issued **Room Code** during setup.
* **Dynamic Whitelist Enforcement:** Restricts navigation (`main_frame`) exclusively to proctor-approved domains via `chrome.declarativeNetRequest`. Any non-whitelisted URL—including restricted Google services like Gmail, Google Drive, and Google Docs—redirects immediately to `blocked.html`.
* **Active Window Focus & Tamper Detection:** Monitors foreground window focus (`chrome.windows.getLastFocused`). If a participant closes Chrome, disables the extension, or works inside another browser/application for more than 90 seconds, heartbeats pause and the dashboard flags the device as **`OFFLINE / TAMPERED`**.
* **Remote Disqualification & Tab Restoration (`DENY` / `ALLOW`):** Proctors can lock a participant's open tabs to `disqualified.html` in real time. Once cleared (`ALLOW`), the extension automatically restores the participant's previously open tabs.
* **Centralized Telemetry Storage:** Uploads randomized screen captures (`.jpg`), capped visited domain history (`domain_logs.json`, up to 200 recent entries), and active Chrome extension inventories (`extensions.json`) directly to Google Drive, viewable live on the Proctor Dashboard Web UI.

## 🌐 Pre-Approved Competition Domains
By default, participants may access:
* **Search:** `google.com` (Search & redirects; Gmail, Drive, and Docs are blocked), `google.ae`, `duckduckgo.com`
* **Code & Hosting:** `github.com`, `codepen.io`, `jsfiddle.net`, `stackblitz.com`, `vercel.app`, `netlify.app`
* **AI Assistants:** `chatgpt.com`, `claude.ai`, `anthropic.com`, `gemini.google.com`

---

## 📁 Extension Package Structure
Ensure all required files are present in the extension directory before loading:
```text
InnoCode-Strict-Guardian/
├── manifest.json        # Extension configuration & permissions (Manifest V3)
├── background.js        # Service worker (heartbeats, focus checks, tab locks, telemetry)
├── popup.html           # Registration popup UI (Room Code + Team Name)
├── popup.js             # Registration validation & local storage lock
├── blocked.html         # Access Denied page for non-whitelisted domains
├── disqualified.html    # Session Disqualified lock screen
└── innoguard.png        # Extension icon (16x16 to 128x128)
```

---

## 📥 Participant Installation Instructions

Participants must load the extension locally via Google Chrome's Developer Mode before the round begins:

### Step 1: Extract the Package
Extract the extension folder to a permanent location on your laptop (do not delete, rename, or move this folder during the event).

### Step 2: Open Chrome Extensions
1. Launch Google Chrome.
2. Navigate to `chrome://extensions/`.

### Step 3: Enable Developer Mode
1. Toggle **Developer mode** to **ON** in the top-right corner.

### Step 4: Load Unpacked Extension
1. Click **Load unpacked**.
2. Select the extracted extension directory containing `manifest.json`.

### Step 5: Register Your Room Code & Team ID
1. When the setup popup opens (or by clicking the **InnoCode Strict Guardian** icon in the Chrome toolbar), enter:
   * **Room Code:** Provided by your room proctor (e.g., `LAB-A`).
   * **Team / Device Name:** Your assigned team identifier (e.g., `Team-01`).
2. Click **Save & Register**. The extension verifies the Room Code with the server and locks in your session.
3. **Keep Chrome in Focus & Do Not Remove the Extension:** Keep your work inside the monitored Chrome window. Removing or reloading an unpacked extension clears local registration and registers a duplicate tamper entry on the proctor dashboard.

---

## 🛠️ Proctor & Administrator Setup (Backend)

1. **Google Sheets & Drive:**
   * Create a Google Sheet (`SPREADSHEET_ID`) for device status/heartbeat tracking (`RoomCode | DeviceName | Status | LastSeen`).
   * Create a root Google Drive folder (`ROOT_FOLDER_ID`) where room and team subfolders will be automatically generated.
2. **Google Apps Script:**
   * Paste `code.gs` and `manager.html` into an Apps Script project.
   * Update `SPREADSHEET_ID` and `ROOT_FOLDER_ID` at the top of `code.gs`.
   * Deploy as a **Web App** (`Execute as: Me`, `Who has access: Anyone`).
3. **Configure Extension Endpoints:**
   * Paste the generated `/exec` Web App URL into `WEB_APP_URL` at the top of both `background.js` and `popup.js` before distributing the extension zip to participants.
4. **Running a Competition Session:**
   * Open the Web App `/exec` URL to access the **Proctor Dashboard**.
   * Enter a **Room Code** in the sidebar and click **+ Create** to initialize the room's Google Drive folder before participants register.
   * Use **Set to DENY** / **Set to ALLOW** on any selected device to lock or restore participant sessions in real time.
5. **Updating Backend Code:**
   * Whenever `code.gs` or `manager.html` is modified, go to **Deploy > Manage deployments > Edit > Version: New version > Deploy** so the live `/exec` URL remains unchanged.