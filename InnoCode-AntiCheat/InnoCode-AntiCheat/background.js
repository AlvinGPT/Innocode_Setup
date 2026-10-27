const globalAPI = (typeof browser !== 'undefined') ? browser : chrome;

// Define your Google Apps Script Web App URL globally so all functions can reach it
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbxnJTnGPoDpX6cqLvELFHHZJQuY_HsT9pH794dt4HJzN0ZdGcR9iQWBhPRG9ZSWWECU/exec";

// Force temporary registration prompt on fresh installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({ deviceName: "Unregistered-Laptop", domainLogs: [] });
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
  }
});

// Log Visited Domains
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    try {
      const urlObj = new URL(tab.url);
      chrome.storage.local.get(['domainLogs'], (result) => {
        let logs = result.domainLogs || [];
        logs.push({ time: new Date().toLocaleTimeString(), domain: urlObj.hostname });
        chrome.storage.local.set({ domainLogs: logs });
      });
    } catch (e) {}
  }
});

// Randomized Screenshot & Telemetry Loop (2 to 7 minutes gap)
function scheduleNextSnapshot() {
  const randomDelay = Math.floor(Math.random() * (420000 - 120000 + 1)) + 120000;
  setTimeout(triggerTelemetryUpload, randomDelay);
}

function triggerTelemetryUpload() {
  chrome.management.getAll((extensions) => {
    const installedExtensions = (extensions || []).map(ext => ({ name: ext.name, enabled: ext.enabled, id: ext.id }));

    chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 40 }, (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        scheduleNextSnapshot();
        return;
      }

      chrome.storage.local.get(['deviceName', 'domainLogs'], (data) => {
        const payload = {
          deviceName: data.deviceName || "Unregistered-Laptop",
          filename: `${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.jpg`,
          image: dataUrl,
          logs: data.domainLogs || [],
          extensions: installedExtensions
        };

        fetch(WEB_APP_URL, {
          method: "POST",
          body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(resData => {
          if (resData && resData.command === "SHUTDOWN") {
            chrome.tabs.update({ url: "data:text/html,<html><body style='background:red;color:white;text-align:center;padding-top:20vh;'><h1>SESSION TERMINATED</h1><p>Malpractice detected or session ended by proctor.</p></body></html>" });
          }
        })
        .catch(err => console.error("Telemetry upload error:", err))
        .finally(() => {
          scheduleNextSnapshot();
        });
      });
    });
  });
}

// Poll server every 30 seconds to check allowance status
chrome.alarms.create("statusCheck", { periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "statusCheck") {
    checkDeviceStatus();
  }
});

function checkDeviceStatus() {
  chrome.storage.local.get(['deviceName'], (data) => {
    const payload = {
      deviceName: data.deviceName || "Unregistered-Laptop",
      heartbeatOnly: true
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resData => {
      if (resData && resData.command === "SHUTDOWN") {
        // Instantly replace all active tabs with the termination page
        chrome.tabs.query({}, (tabs) => {
          tabs.forEach(tab => {
            chrome.tabs.update(tab.id, { 
              url: "data:text/html,<html><body style='background:%23111;color:%23ff4d4d;text-align:center;padding-top:20vh;font-family:sans-serif;'><h1>SESSION DISQUALIFIED</h1><p>Your device has been revoked by the proctor.</p></body></html>" 
            });
          });
        });
      }
    })
    .catch(err => console.error("Heartbeat check failed:", err));
  });
}

// Start randomized telemetry loop
scheduleNextSnapshot();

