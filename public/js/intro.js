let intro_countdownElement = document.getElementsByClassName("intro-countdown")[0];
let intro_scheduleElement = document.getElementsByClassName("intro-schedule")[0];

let schedule = new Date();


//
// UI Update Functions

function intro_updateCountdown() {
    if (schedule >= new Date()) {
        intro_countdownElement.style.fontSize = "96px";
        intro_countdownElement.classList.add("monospace");
        intro_countdownElement.innerText = secondsToMMSS((schedule - new Date()) / 1000);
    } else {
        intro_countdownElement.style.fontSize = "48px";
        intro_countdownElement.innerText = "Starting Soon!";
    }
}
setInterval(intro_updateCountdown, 200);

function intro_updateSchedule(inputSchedule) {
    schedule = new Date(inputSchedule);
    intro_scheduleElement.innerText = `${schedule.getFullYear()}.${(schedule.getMonth() + 1).toString().padStart(2, "0")}.${schedule.getDate().toString().padStart(2, "0")}. ${schedule.getHours().toString().padStart(2, "0")}:${schedule.getMinutes().toString().padStart(2, "0")} (KST)`;
}


//
// Update Function

function intro_update(){
    intro_updateSchedule(overlayData.schedule);
}
setInterval(intro_update, 1000);