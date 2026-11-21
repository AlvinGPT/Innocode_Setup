const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbzwGYoLXlCWSKZUckf-EUFXyN5sNynQogddvlm5h8bcivjUsPyfHSzDO5ie7zagRHG5Kg/exec";

let lastCheckTime = 0;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.storage.local.set({ deviceName: "Unregistered-Laptop", domainLogs: [], isDisqualified: false });
    chrome.tabs.create({ url: chrome.runtime.getURL("popup.html") });
  }
  initExtension();
});

chrome.runtime.onStartup.addListener(() => {
  initExtension();
});

// Ensure alarms exist whenever the service worker wakes up
chrome.alarms.get("telemetryUpload", (alarm) => {
  if (!alarm) {
    chrome.alarms.create("telemetryUpload", { delayInMinutes: 0.25 });
  }
});

chrome.alarms.get("statusCheck", (alarm) => {
  if (!alarm) {
    chrome.alarms.create("statusCheck", { delayInMinutes: 0.05, periodInMinutes: 1 });
  }
});

function initExtension() {
  chrome.alarms.create("statusCheck", { delayInMinutes: 0.05, periodInMinutes: 1 });
  // Run first telemetry upload 15 seconds after install/reload, then every 2-5 mins
  chrome.alarms.create("telemetryUpload", { delayInMinutes: 0.25 });
  updateWhitelistRules();
  checkDeviceStatus();
}

function scheduleNextTelemetryAlarm() {
  const delayInMinutes = Math.floor(Math.random() * 4) + 2;
  chrome.alarms.create("telemetryUpload", { delayInMinutes });
}

function throttledStatusCheck() {
  const now = Date.now();
  if (now - lastCheckTime > 3000) {
    lastCheckTime = now;
    checkDeviceStatus();
  }
}

// Instant check on tab switch or window focus
chrome.tabs.onActivated.addListener(() => throttledStatusCheck());
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE) throttledStatusCheck();
});

// Single unified tab listener: DENY lock + status check + capped domain logging
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const currentUrl = changeInfo.url || tab.url;
  if (!currentUrl) return;

  if (changeInfo.status === 'loading') {
    throttledStatusCheck();

    if (!currentUrl.startsWith('chrome-extension://') && !currentUrl.startsWith('chrome://')) {
      chrome.storage.local.get(['isDisqualified'], (res) => {
        if (res.isDisqualified) {
          chrome.tabs.update(tabId, { url: chrome.runtime.getURL("disqualified.html") });
        }
      });
    }
  }

  // Log whenever a new HTTP/HTTPS URL is committed or finishes loading
  if ((changeInfo.url || changeInfo.status === 'complete') && currentUrl.startsWith('http')) {
    try {
      const urlObj = new URL(currentUrl);
      const hostname = urlObj.hostname;
      chrome.storage.local.get(['domainLogs'], (result) => {
        let logs = result.domainLogs || [];
        const lastEntry = logs[logs.length - 1];
        // Avoid logging the exact same domain twice in a row within the same minute
        const nowTime = new Date().toLocaleTimeString();
        if (!lastEntry || lastEntry.domain !== hostname || lastEntry.time !== nowTime) {
          logs.push({ time: nowTime, domain: hostname });
          if (logs.length > 200) logs = logs.slice(-200);
          chrome.storage.local.set({ domainLogs: logs });
        }
      });
    } catch (e) {}
  }
});
// Single unified alarm listener
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "statusCheck" || alarm.name === "fastUnlockCheck") {
    checkDeviceStatus();
    if (alarm.name === "statusCheck") updateWhitelistRules();
  } else if (alarm.name === "telemetryUpload") {
    triggerTelemetryUpload();
  }
});

function triggerTelemetryUpload() {
  chrome.storage.local.get(['deviceName', 'domainLogs'], (data) => {
    // Skip uploading ghost telemetry before participant registers their team name
    if (!data.deviceName || data.deviceName === "Unregistered-Laptop") {
      scheduleNextTelemetryAlarm();
      return;
    }

    chrome.management.getAll((extensions) => {
      const installedExtensions = (extensions || []).map(ext => ({
        name: ext.name,
        enabled: ext.enabled,
        id: ext.id
      }));

      chrome.tabs.captureVisibleTab(null, { format: "jpeg", quality: 40 }, (dataUrl) => {
        const captureErr = chrome.runtime.lastError;
        if (captureErr) {
          console.warn("Screenshot skipped (active tab not capturable):", captureErr.message);
        }
        const validImage = (!captureErr && dataUrl) ? dataUrl : null;

        const payload = {
          deviceName: data.deviceName,
          filename: `${new Date().toTimeString().split(' ')[0].replace(/:/g, '-')}.jpg`,
          image: validImage,
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
            chrome.storage.local.set({ isDisqualified: true });
            enforceShutdown();
          }
        })
        .catch(err => console.error("Telemetry upload error:", err))
        .finally(() => {
          scheduleNextTelemetryAlarm();
        });
      });
    });
  });
}

async function updateWhitelistRules() {
  try {
    const response = await fetch(`${WEB_APP_URL}?action=getWhitelistRules`);
    const rules = await response.json();

    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIdsToRemove = existingRules.map(rule => rule.id);

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: rules
    });
  } catch (err) {
    console.error("Failed to update whitelist:", err);
  }
}

function checkDeviceStatus() {
  chrome.storage.local.get(['deviceName', 'isDisqualified'], (data) => {
    // Do not create an Unregistered-Laptop row before setup finishes
    if (!data.deviceName || data.deviceName === "Unregistered-Laptop") return;

    const payload = {
      deviceName: data.deviceName,
      heartbeatOnly: true
    };

    fetch(WEB_APP_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(resData => {
      if (resData && resData.command === "SHUTDOWN") {
        chrome.storage.local.set({ isDisqualified: true });
        enforceShutdown();
        chrome.alarms.create("fastUnlockCheck", { delayInMinutes: 0.08 });
      } else if (resData && resData.command === "CONTINUE") {
        const wasDisqualified = data.isDisqualified;
        chrome.storage.local.set({ isDisqualified: false });
        chrome.alarms.clear("fastUnlockCheck");
        if (wasDisqualified) {
          releaseShutdown();
        }
      }
    })
    .catch(err => console.error("Heartbeat check failed:", err));
  });
}

function enforceShutdown() {
  const dqUrl = chrome.runtime.getURL("disqualified.html");
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url && !tab.url.startsWith("chrome://") && tab.url !== dqUrl) {
        chrome.tabs.update(tab.id, { url: dqUrl });
      }
    });
  });
}

function releaseShutdown() {
  const dqUrl = chrome.runtime.getURL("disqualified.html");
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (tab.url === dqUrl) {
        chrome.tabs.update(tab.id, { url: "https://www.google.com/search?q=InnoCode" });
      }
    });
  });
}
