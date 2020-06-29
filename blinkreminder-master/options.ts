/// <reference types="chrome" />

interface BlinkReminderSettings {
  remindInterval: number;
  breakInterval: number;
  breakDuration: number;
  notificationOnShortBreak: boolean;
  notificationOnLongBreak: boolean;
}

interface GetSettingsCallback {
  (settings: BlinkReminderSettings): void
}


 function loadOptions (): void {
  chrome.storage.local.get({
    remindInterval: 20,
    breakInterval: 60,
    breakDuration: 10,
    notificationOnShortBreak: true,
    notificationOnLongBreak: true
  }, optionsLoaded)
}

function optionsLoaded (settings: BlinkReminderSettings) {
  (document.querySelector("#remindInterval") as HTMLInputElement).value = settings.remindInterval.toString();
  (document.querySelector("#breakInterval") as HTMLInputElement).value = settings.breakInterval.toString();
  (document.querySelector("#breakDuration") as HTMLInputElement).value = settings.breakDuration.toString();
  (document.querySelector("#soundOnShortBreak") as HTMLInputElement).checked = settings.notificationOnShortBreak;
  (document.querySelector("#soundOnLongBreak") as HTMLInputElement).checked = settings.notificationOnLongBreak;
  document.querySelector("#settingsForm").addEventListener("submit", saveOptions);
}

function saveOptions () {
  console.log("saving settings");
  let newSettings: BlinkReminderSettings = {
    remindInterval: parseInt ((document.querySelector("#remindInterval") as HTMLInputElement).value, 10),
    breakInterval: parseInt ((document.querySelector("#breakInterval") as HTMLInputElement).value, 10),
    breakDuration:  parseInt ((document.querySelector("#breakDuration") as HTMLInputElement).value, 10),
    notificationOnShortBreak: (document.querySelector("#soundOnShortBreak") as HTMLInputElement).checked as boolean,
    notificationOnLongBreak: (document.querySelector("#soundOnLongBreak") as HTMLInputElement).checked as boolean
  }
  chrome.storage.local.set(newSettings, settingSavedCallback);
}

function settingSavedCallback () {
  if (chrome.runtime.lastError){
    console.error("Error saving settings ".concat(chrome.runtime.lastError.message));
  } else {
    console.log("Settings saved");
  }
}

document.addEventListener('DOMContentLoaded', loadOptions);
