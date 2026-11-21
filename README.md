# 🛡️ InnoCode Strict Guardian: Official Proctoring & Telemetry Agent

> **CRITICAL SECURITY NOTICE:** This software is a mandatory, active proctoring and telemetry agent for all competition participants. Modifying source files, disabling Developer Mode, closing the monitored browser session, or removing/reloading this extension during the competition triggers an immediate **`OFFLINE / TAMPERED`** alert on the proctor dashboard and constitutes a direct violation of competition rules.

## 📋 Overview
**InnoCode Strict Guardian** (v2.1) is a cloud-managed Manifest V3 browser agent designed to ensure a fair competition environment. It enforces dynamic domain whitelisting, logs visited domains and installed Chrome extensions, captures periodic randomized screen snapshots, and provides real-time proctor lockout (`DENY`) and clearance (`ALLOW`) controls.

## ⚙️ Architecture & Features
* **Dynamic Whitelist Enforcement:** Restricts navigation (`main_frame`) exclusively to proctor-approved domains via `chrome.declarativeNetRequest`. Any non-whitelisted URL redirects immediately to `blocked.html`.
* **Live Heartbeat & Tamper Detection:** Sends periodic and event-driven heartbeats to the backend. If a participant closes Chrome, loses connection, or disables the extension for more than 90 seconds, the dashboard flags the device as **`OFFLINE / TAMPERED`**.
* **Remote Disqualification (`DENY` / `ALLOW`):** Proctors can lock a participant's browser to `disqualified.html` in real time and release them back into the session once cleared.
* **Centralized Telemetry Storage:** Uploads randomized screen captures (`.jpg`), visited domain history (`domain_logs.json`), and active Chrome extension inventories (`extensions.json`) directly to a designated Google Drive folder, viewable from the Proctor Dashboard Web UI.

## 🌐 Pre-Approved Competition Domains
By default, participants may access:
* **Search:** `google.com/search`, `duckduckgo.com`
* **Code & Hosting:** `github.com`, `codepen.io`, `jsfiddle.net`, `stackblitz.com`, `vercel.app`, `netlify.app`
* **AI Assistants:** `chatgpt.com`, `claude.ai`, `anthropic.com`, `gemini.google.com`

---

## 📥 Participant Installation Instructions

Participants must load the extension locally via Google Chrome's Developer Mode before the round begins:

### Step 1: Extract the Package
Extract the extension folder to a permanent location on your laptop (do not delete or move this folder during the event).

### Step 2: Open Chrome Extensions
1. Launch Google Chrome.
2. Navigate to `chrome://extensions/`.

### Step 3: Enable Developer Mode
1. Toggle **Developer mode** to **ON** in the top-right corner.

### Step 4: Load Unpacked Extension
1. Click **Load unpacked**.
2. Select the extracted extension directory containing `manifest.json`.

### Step 5: Register Your Team / Device ID
1. When the setup popup opens (or by clicking the **InnoCode Strict Guardian** icon in the toolbar), enter your assigned **Team/Device Name** (e.g., `Team-Alpha-01`).
2. Click **Save & Register**. Once locked in, telemetry and heartbeat monitoring begin automatically.
3. **Do not remove or reload the extension** once registered—removing an unpacked extension clears local registration and registers a duplicate tamper entry on the proctor dashboard.

---


