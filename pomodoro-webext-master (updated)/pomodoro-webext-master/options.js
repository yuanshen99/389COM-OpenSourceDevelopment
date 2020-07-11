const context = {
    volume: 100,
    showMinutes: false,
    customSoundData: "",
    customSoundFilename: ""
};

/**
 * Displays a message for a short time.
 * @param {String} txt Message to display.
 */
const displayMessage = (txt) => {
    document.getElementById("messages").innerHTML = txt;
    window.setTimeout(() => { document.getElementById("messages").innerHTML = "&nbsp;"; }, 3000);
};

/**
 * Restores the options saved into local storage
 */
const restoreOptions = () => {
    context.volume = localStorage.volume;
    if (context.volume === undefined) {
        context.volume = 100;
    }
    document.getElementById("volume_value").innerHTML = context["volume"];
    document.getElementById("volume").value = context["volume"];
    //fetch back the task inserted
    if (localStorage.task == undefined) {
        document.getElementById("taskText").innerHTML = "Please set a task here";
    }
    else {
        document.getElementById("taskText").innerHTML = localStorage.task;
    }

    if (localStorage.clockColor == undefined) {
        localStorage.clockColor = "#000000";
    }
    else {
        document.getElementById("clockBackground").value = localStorage.clockColor;
    }

    if (localStorage.clockMinutesColor == undefined) {
        localStorage.clockMinutesColor = "#ffffff";
    }
    else {
        document.getElementById("clockMinutesHand").value = localStorage.clockMinutesColor;
    }

    if (localStorage.clockSecondsColor == undefined) {
        localStorage.clockSecondsColor = "#81B5A1";
    }
    else {
        document.getElementById("clockSecondsHand").value = localStorage.clockSecondsColor;
    }


    context.showMinutes = (localStorage.showMinutes === true || localStorage.showMinutes === "true" || localStorage.showMinutes === undefined);
    document.getElementById("showMinutes").checked = context.showMinutes;

    let customSoundElt = document.getElementById("customSound");
    let soundFileElt = document.getElementById("soundFile");

    document.getElementById("customSound").onchange = (evt) => {
        context.customSound = customSoundElt.checked;
        if (customSoundElt.checked) {
            soundFileElt.style.visibility = "visible";
        } else {
            soundFileElt.style.visibility = "hidden";
        }
    };
    context.customSound = (localStorage.customSound === true || localStorage.customSound === "true");
    customSoundElt.checked = context.customSound;
    customSoundElt.onchange();
    context.customSoundData = localStorage.customSoundData || "";

    soundFileElt.onchange = () => {
        context.customSoundFilename = soundFileElt.value.split(/(\\|\/)/g).pop();
        document.getElementById("customSoundFilename").innerText = "";
        const file = soundFileElt.files[0];
        const reader = new FileReader();
        reader.addEventListener("load", function () {
            context.customSoundData = reader.result;
        }, false);
        if (file) {
            reader.readAsDataURL(file);
        }
    }

    context.customSoundFilename = (localStorage.customSoundFilename || "");
    if (context.customSoundFilename !== "") {
        document.getElementById("customSoundFilename").innerText = " (current: " + context.customSoundFilename + ")";
    }


    document.getElementById("volume").oninput = (evt) => {
        context.volume = evt.target.value;
        updateField("volume");
    };

    document.getElementById("volume_test").onclick = (evt) => {
        context.ring = document.createElement("audio");
        console.log((context.customSound && context.customSoundData));
        if (context.customSound && context.customSoundData) {
            context.ring.setAttribute("src", context.customSoundData);
        } else {
            context.ring.setAttribute("src", "sound/bell-ringing-02.mp3");
        }
        context.ring.volume = context.volume / 100;
        context.ring.play();
        window.setTimeout(() => {
            context.ring.pause();
        }, 5000);
    };
    document.querySelector("form").addEventListener("submit", saveOptions);
};

/**
 * Saves the options into sync storage
 * @param {object} evt the event that triggered the action
 */
const saveOptions = (evt) => {
    evt.preventDefault();
    try {
        localStorage.volume = context.volume;
        localStorage.showMinutes = document.getElementById("showMinutes").checked;
        localStorage.customSound = document.getElementById("customSound").checked;
        if (!document.getElementById("customSound").checked) {
            context.customSoundData = "";
            context.customSoundFilename = "";
        }
        //get the value inserted into textbox and set it to local storage to display in popup screen and notifications
        context.task = document.getElementById("taskText").value
        localStorage.task = context.task;

        //get the color and save to local storage
        context.clockColor = document.getElementById("clockBackground").value;
        localStorage.clockColor = context.clockColor;

        //get the minutes hand color and save to local storage
        context.clockMinutesColor = document.getElementById("clockMinutesHand").value;
        localStorage.clockMinutesColor = context.clockMinutesColor;

        //get the seconds hand color and save to local storage
        context.clockSecondsColor = document.getElementById("clockSecondsHand").value;
        localStorage.clockSecondsColor = context.clockSecondsColor;

        localStorage.customSoundData = context.customSoundData;
        localStorage.customSoundFilename = context.customSoundFilename;
        window.location.reload(true);
    } catch (e) {
        displayMessage("Options could not be saved. Is storage enabled?");
        console.log(e);
    }
};

document.addEventListener("DOMContentLoaded", restoreOptions);
