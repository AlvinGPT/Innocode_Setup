# 🛡️ SecureProctor: Official Telemetry & Integrity Agent

> **CRITICAL SECURITY NOTICE:** This software is a mandatory, active proctoring and telemetry agent for competition participants. Unauthorized modification, tampering, or disabling of this extension violates competition rules.

---

## ⚠️ Anti-Malpractice & Edge Monitoring Protocol

Before proceeding with installation, all participants must understand the monitoring architecture embedded within this environment:

* **Active Telemetry & Surveillance:** The extension runs background background workers that capture periodic environment snapshots and log active browsing domains.
* **The Dead-Man's Switch:** Our backend tracks a real-time rolling heartbeat. If the background worker is paused, the code is modified, or the telemetry loop is silenced, your device will flatline on our proctor dashboard. 
* **Zero-Tolerance Policy:** Any attempt to comment out JavaScript loops, block network endpoints, or bypass the extension will result in an **immediate, unappealable disqualification**. Our server logs state changes independently of what runs locally on your machine.

---

## 📥 Installation Instructions

Because this extension enforces strict security policies, it must be loaded locally via Chrome's developer toolset. Follow these steps precisely before the competition timer starts:

### Step 1: Download & Extract to a Permanent Location
1. Download the official extension package (`.zip`) provided by the organizers.
2. **Crucial:** Extract the ZIP file into a **permanent folder** on your laptop (e.g., create a folder named `ProctorAgent` inside your Documents or a dedicated workspace). 
   * *Do not delete or move this folder after installation, or Chrome will disable the extension.*

### Step 2: Open Chrome Extensions Manager
1. Open Google Chrome.
2. Type or paste the following URL into your address bar and hit Enter:
   ```text
   chrome://extensions/
