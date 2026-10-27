document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('deviceNameInput');
  const saveBtn = document.getElementById('saveBtn');
  const status = document.getElementById('status');
  const instruction = document.getElementById('instruction');
  
  chrome.storage.local.get(['deviceName'], (result) => {
    if (result.deviceName && result.deviceName !== "Unregistered-Laptop") {
      input.value = result.deviceName;
      input.disabled = true;
      saveBtn.style.display = 'none';
      instruction.textContent = "Registered Team Name:";
      status.textContent = "Locked (Setup Complete)";
    }
  });

  saveBtn.addEventListener('click', () => {
    const name = input.value.trim();
    if (name) {
      chrome.storage.local.set({ deviceName: name }, () => {
        status.textContent = "Successfully Registered!";
        input.disabled = true;
        saveBtn.style.display = 'none';
        setTimeout(() => window.close(), 1500);
      });
    } else {
      status.style.color = "red";
      status.textContent = "Please enter a valid name.";
    }
  });
});