let intro_countdownElements = document.getElementsByClassName("intro-countdown");
let intro_scheduleElements = document.getElementsByClassName("intro-schedule");

let schedule = new Date();

function intro_updateCountdown(secondsLeft) {
    intro_countdownElements.forEach(function (element) {
        element.innerText = secondsToMMSS(secondsLeft);
    });
}

function intro_updateSchedule(ISOschedule) {
    schedule = new Date(ISOschedule);
    intro_scheduleElements.forEach(function (element) {
        element.innerText = "{0}.{1}.{2}. {3}:{4} (KST)".format(schedule.getFullYear(), (schedule.getMonth() + 1).toString().padStart(2, "0"), schedule.getDate().toString().padStart(2, "0"), schedule.getHours().toString().padStart(2, "0"), schedule.getMinutes().toString().padStart(2, "0"));
    });
}