# 🛡️ SecureProctor: Official Telemetry & Integrity Agent

> **CRITICAL SECURITY NOTICE:** This software is a mandatory, active proctoring and telemetry agent for all competition participants. Unauthorized modification, code tampering, or disabling of this extension constitutes a direct violation of competition rules.

## 📋 Overview

SecureProctor is a lightweight browser-based telemetry agent designed to ensure a fair and transparent competition environment. It runs background monitoring tasks to capture device telemetry, active domain activity, and periodic environment snapshots, transmitting them directly to the event proctoring dashboard.

## ⚠️ Anti-Malpractice & Edge Monitoring Protocol

Before proceeding with installation, all participants must review and understand the automated security architecture embedded within this environment:

* **Active Telemetry & Surveillance:** The extension operates continuous background service workers that record active browsing domains and capture randomized environment snapshots at set intervals.
* **The Dead-Man's Switch (Heartbeat Monitoring):** Our backend infrastructure tracks a real-time, rolling heartbeat from every registered device. If a participant pauses the service worker, modifies source files, or blocks network endpoints, their device will immediately register as inactive on the proctor control panel.
* **Zero-Tolerance Disqualification:** Any detected attempt to alter the JavaScript execution loops, manipulate allowlists, intercept network payloads, or unload the extension during competition hours will result in **immediate, unappealable disqualification**. Server-side state changes are logged independently of local machine operations.

## 📥 Installation Instructions

Because this security agent enforces strict runtime permissions, it must be loaded locally via Google Chrome's developer toolkit. Follow these steps precisely before the competition officially begins:

### Step 1: Download & Extract

1. Download the official extension package archive (`.zip`) provided by the competition administrators.
2. **Crucial:** Extract the contents of the ZIP file into a **permanent directory** on your laptop (e.g., create a dedicated folder such as `C:\ProctorAgent` or `~/Documents/ProctorAgent`).

> *Note: Do not delete, rename, or move this folder after installation. If the source folder is altered, Chrome will automatically unmount the extension.*

### Step 2: Access Chrome Extensions

1. Launch Google Chrome.
2. Navigate to the extension manager by entering the following URL into your address bar:
   `chrome://extensions/`

### Step 3: Enable Developer Mode

1. Locate the **Developer mode** toggle switch in the top-right corner of the Extensions page.
2. Switch **Developer mode** to the **ON** position. Additional control buttons will appear at the top of the page.

### Step 4: Load Unpacked Extension

1. Click the **Load unpacked** button in the top-left section.
2. In the file picker, navigate to and select the permanent folder where you extracted the extension files (select the directory containing the `manifest.json` file).
3. Click **Select Folder** (or **Open**).

### Step 5: Initial Setup & Verification

1. Verify that the **SecureProctor** extension card is visible and enabled in your extensions list.
2. Complete the initial registration prompt if prompted by entering your assigned Team/Device identifier.
3. Ensure all background permissions are granted so the telemetry loop can initialize properly.

## 🛠️ Troubleshooting & Support

If you encounter issues during initialization or notice service worker errors:

* Ensure your network connection allows outgoing `POST` requests to Google Apps Script endpoints.
* Verify that Google Chrome is updated to the latest stable release.
* Contact an onsite technical proctor immediately if your extension fails to generate a valid registration ID.
