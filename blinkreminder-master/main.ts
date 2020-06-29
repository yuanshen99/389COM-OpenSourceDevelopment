/// <reference types="chrome" />
/// <reference path="options.ts" />

class BlinkReminder {

  settings: BlinkReminderSettings = null;
  timeWithoutBreak: number = 0;
  lastStateChangeTimestamp: number = 0;


  init (settings: BlinkReminderSettings): void {
      chrome.idle.setDetectionInterval(60);
      chrome.storage.onChanged.addListener(this.onSettingsChanged);
      chrome.idle.onStateChanged.addListener(this.onStateChanged);
      chrome.alarms.onAlarm.addListener(this.onAlarmFired);
      chrome.browserAction.onClicked.addListener(() => {
        chrome.runtime.openOptionsPage();
      });
      this.lastStateChangeTimestamp = Date.now();
      chrome.alarms.create("reminder_alarm", {periodInMinutes: settings.remindInterval});
      console.log("addon loaded");
  }
  onStateChanged (newState: string): void {
    let now: Date = new Date();
    console.log(blinkReminder.getTimeForLogging().concat(": state change, new state ", newState));
    if (newState != "active"){
      blinkReminder.timeWithoutBreak += Math.round((now.getTime() - blinkReminder.lastStateChangeTimestamp) / (60 * 1000));
      chrome.alarms.clearAll();
    } else if (newState == "active") {
      let diff: number = now.getTime() - blinkReminder.lastStateChangeTimestamp;
      let minutes: number = Math.round(diff / (1000 * 60));
      if (minutes >= (blinkReminder.settings.breakDuration-1)){ // because 1 minute passes bewfore we go in idle srare
        console.log(blinkReminder.getTimeForLogging().concat(": away for ", (diff / (1000 * 60)).toString(), "m reseting break timer"));
        blinkReminder.timeWithoutBreak = 0;
      } else {
        console.log(blinkReminder.getTimeForLogging().concat(": short break for ", minutes.toString(), " minutes"));
        blinkReminder.timeWithoutBreak -= minutes;
      }
      chrome.alarms.create("reminder_alarm", {periodInMinutes: blinkReminder.settings.remindInterval});
    }
    blinkReminder.lastStateChangeTimestamp = now.getTime();
  }
  onAlarmFired (alarm: chrome.alarms.Alarm): void {
    blinkReminder.timeWithoutBreak += blinkReminder.settings.remindInterval;
    if (blinkReminder.timeWithoutBreak >= blinkReminder.settings.breakInterval){
        console.log(blinkReminder.getTimeForLogging().concat(": long break, without break since ",  blinkReminder.timeWithoutBreak.toString(), " minutes" ));
        chrome.notifications.create("look_away", {type: "basic", title: "Blink Reminder", iconUrl:"icons/eye-open64.png",
                                    message: "Take a break for ".concat(blinkReminder.settings.breakDuration.toString(), " minutes")});
    } else {
        console.log(blinkReminder.getTimeForLogging().concat(": short break, without break since ",  blinkReminder.timeWithoutBreak.toString(), " minutes" ));
        chrome.notifications.create("look_away", {type: "basic", title: "Blink Reminder", iconUrl:"icons/eye-open64.png",
                                    message: "Look away from the monitor."});
      }
  }
  loadSettings (): void {
    chrome.storage.local.get({
      remindInterval: 20,
      breakInterval: 60,
      breakDuration: 10
    }, (s: BlinkReminderSettings) =>{
      if (!chrome.runtime.lastError){
        blinkReminder.settings = s;
        blinkReminder.init(s);
      } else {
        console.error("Error loading settings ".concat(chrome.runtime.lastError.message));
      }
    });
  }
  onSettingsChanged (change: {[key: string]: chrome.storage.StorageChange} , area: string): void {
    chrome.alarms.clearAll();
    blinkReminder.settings.remindInterval = change["remindInterval"].newValue;
    blinkReminder.settings.breakInterval = change["breakInterval"].newValue;
    blinkReminder.settings.breakDuration = change["breakDuration"].newValue;
    chrome.alarms.create("reminder_alarm", {periodInMinutes: blinkReminder.settings.remindInterval});

  }
  getTimeForLogging (): string {
    let now: Date = new Date();
    let hours: string = now.getHours() > 9 ? now.getHours().toString(): "0" + now.getHours().toString();
    let minutes: string = now.getMinutes() > 9 ? now.getMinutes().toString(): "0" + now.getMinutes().toString();
    return "[".concat(hours, ":", minutes, "]");
  }
}


const blinkReminder: BlinkReminder = new BlinkReminder();
blinkReminder.loadSettings();
