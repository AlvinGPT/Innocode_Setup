const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbx9lkWfoPi5p-e6A23a4Y0K6UZHmJitB7iJSFmtwB08lwaINMGEN0C4P9QwqsXCNLSrPw/exec";

document.addEventListener('DOMContentLoaded', () => {
  const roomInput = document.getElementById('roomCodeInput');
  const nameInput = document.getElementById('deviceNameInput');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const instruction = document.getElementById('instruction');

  chrome.storage.local.get(['roomCode', 'deviceName'], (result) => {
    if (result.roomCode && result.deviceName && result.deviceName !== "Unregistered-Laptop") {
      roomInput.value = result.roomCode;
      nameInput.value = result.deviceName;
      roomInput.disabled = true;
      nameInput.disabled = true;
      saveBtn.style.display = 'none';
      instruction.textContent = "Registered Session:";
      status.textContent = "Locked (Setup Complete)";
    }
  });

  saveBtn.addEventListener('click', async () => {
    const roomCode = roomInput.value.trim().toUpperCase();
    const deviceName = nameInput.value.trim();

    if (!roomCode || !deviceName) {
      status.style.color = "red";
      status.textContent = "Enter both Room Code and Team Name.";
      return;
    }

    saveBtn.disabled = true;
    status.style.color = "#555";
    status.textContent = "Verifying Room Code...";

    try {
      const res = await fetch(`${WEB_APP_URL}?action=validateRoom&roomCode=${encodeURIComponent(roomCode)}`);
      const data = await res.json();

      if (!data.valid) {
        status.style.color = "red";
        status.textContent = "Invalid Room Code!";
        saveBtn.disabled = false;
        return;
      }

      chrome.storage.local.set({ roomCode: roomCode, deviceName: deviceName }, () => {
        status.style.color = "green";
        status.textContent = "Successfully Registered!";
        roomInput.disabled = true;
        nameInput.disabled = true;
        saveBtn.style.display = 'none';
        setTimeout(() => window.close(), 1500);
      });
    } catch (err) {
      status.style.color = "red";
      status.textContent = "Connection error. Try again.";
      saveBtn.disabled = false;
    }
  });
});
