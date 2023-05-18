const ReconnectingWebSocket = require("reconnecting-websocket");
const socket = new ReconnectingWebSocket("ws://127.0.0.1:24050/ws");

socket.onopen = () => {
    console.log("Successfully Connected to Gosumemory!");
}

socket.onclose = event => {
    console.log("Socket Closed Connection: ", event);
    socket.send("Client Closed!");
}

socket.onerror = error => {
    console.log("Socket Error: ", error);
}

//functions

//main
let tempState;
let tempHitCount = new Array(3);
let tempCombo;
let tempTitle;
let hdfl;

socket.onmessage = event => {
    let data = JSON.parse(event.data);

    //menu state changed?
    if (tempState != data.menu.state) {
        console.log("menu state change!");
        globs.showLivebar(data.menu.state == 2 || data.menu.state == 7);
        globs.showUR(data.menu.state == 2);
        globs.showLbImage(data.menu.state == 2);
        globs.showGrade(data.menu.state == 2);
    }

    //title and metadata
    var titleText = data.menu.bm.metadata.artist + ' - ' + data.menu.bm.metadata.title + ' [' + data.menu.bm.metadata.difficulty + '] by ' + data.menu.bm.metadata.mapper;
    if (tempTitle != titleText) {
        console.log("map change!");
        globs.updateTitle(titleText);
    }
    globs.csElement.innerText = data.menu.bm.stats.CS;
    globs.arElement.innerText = data.menu.bm.stats.AR;
    globs.odElement.innerText = data.menu.bm.stats.OD;
    globs.hpElement.innerText = data.menu.bm.stats.HP;
    globs.srElement.innerText = data.menu.bm.stats.fullSR;

    var maxBpm = Math.round(data.menu.bm.stats.BPM.max);
    var minBpm = Math.round(data.menu.bm.stats.BPM.min);
    var bpmText = minBpm == maxBpm ? minBpm : (minBpm + "-" + maxBpm);
    globs.bpmElement.innerText = bpmText;

    //pp
    if (data.gameplay.pp.current != '') {
        let pp = data.gameplay.pp.current;
        globs.ppElement.innerText = Math.round(pp) + "pp";
    } else {
        globs.ppElement.innerText = '0pp';
    }

    //ur
    if (data.gameplay.hits.unstableRate != '') {
        animation.urElement.update(data.gameplay.hits.unstableRate);
    } else {
        animation.urElement.update(0);
    }

    //hit
    globs.hit100Element.innerText = data.gameplay.hits[100] > 0 ? data.gameplay.hits[100] : 0;
    globs.hit50Element.innerText = data.gameplay.hits[50] > 0 ? data.gameplay.hits[50] : 0;
    globs.hit0Element.innerText = data.gameplay.hits[0] > 0 ? data.gameplay.hits[0] : 0;

    //grade
    if (data.menu.mods.str.includes("HD") || data.menu.mods.str.includes("FL")) {
        hdfl = true;
    } else hdfl = false;

    if (data.gameplay.hits.grade.current == 'SS') {
        globs.gradeElement.src = hdfl ? "images/grades/ranking-xh-small@2x.png" : "images/grades/ranking-x-small@2x.png";
    } else if (data.gameplay.hits.grade.current == 'S') {
        globs.gradeElement.src = hdfl ? "images/grades/ranking-sh-small@2x.png" : "images/grades/ranking-s-small@2x.png";
    } else if (data.gameplay.hits.grade.current == 'A') {
        globs.gradeElement.src = "images/grades/ranking-a-small@2x.png";
    } else if (data.gameplay.hits.grade.current == 'B') {
        globs.gradeElement.src = "images/grades/ranking-b-small@2x.png";
    } else if (data.gameplay.hits.grade.current == 'C') {
        globs.gradeElement.src = "images/grades/ranking-c-small@2x.png";
    } else if (data.gameplay.hits.grade.current == 'D') {
        globs.gradeElement.src = "images/grades/ranking-d-small@2x.png";
    } else {
    }

    //progress
    globs.progressElement.style.width = currentPercentage(data.menu.bm.time) + "%";

    if (data.gameplay.hits[0] + data.gameplay.hits[50] + data.gameplay.hits[100] == 0) {
        clearProgress();
    } else {
        //var comboBreak = data.gameplay.hits[0] + data.gameplay.hits[50] + data.gameplay.hits[100] > tempHitCount[0] + tempHitCount[1] + tempHitCount[2] && (data.gameplay.combo.current == 0 || data.gameplay.combo.current < tempCombo);
        var hitType;
        if (tempHitCount[0] < data.gameplay.hits[100]) {
            hitType = 0;
        } else if (tempHitCount[1] < data.gameplay.hits[50]) {
            hitType = 1;
        } else if (tempHitCount[2] < data.gameplay.hits[0]) {
            hitType = 2;
        } else {
        }
        appendError(hitType, data.menu.bm.time);
    }

    //Update temp variables
    tempState = data.menu.state;
    tempTitle = titleText;
    tempHitCount = [data.gameplay.hits[100], data.gameplay.hits[50], data.gameplay.hits[0]];
    tempCombo = data.gameplay.combo.current;
}