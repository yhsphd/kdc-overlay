let mapCompactElements;
let mapCompact_pickElements;
let mapCompact_codeElements;
let mapCompact_winTextElements;
let mapCompact_circleElements;
let mapCompact_playIcons;

function mapCompact_getDOM() {
  try {
    mapCompactElements = document.getElementsByClassName("lobby-mapCompact");
    mapCompact_pickElements = document.getElementsByClassName(
      "lobby-mapCompact-pick"
    );
    mapCompact_codeElements = document.getElementsByClassName(
      "lobby-mapCompact-map"
    );
    mapCompact_winTextElements = document.getElementsByClassName(
      "lobby-mapCompact-winText"
    );
    mapCompact_circleElements = document.querySelectorAll(
      ".lobby-mapCompact .circle"
    );
    mapCompact_playIcons = document.getElementsByClassName(
      "lobby-mapCompact-play"
    );

    if (mapCompact_hidden) {
      mapCompact_showMapCompacts(true);
    }
  } catch (e) {
    setTimeout(mapCompact_getDOM, 1000);
  }

  if (
    !(
      mapCompactElements.length *
      mapCompact_pickElements.length *
      mapCompact_codeElements.length *
      mapCompact_winTextElements.length *
      mapCompact_circleElements.length *
      mapCompact_playIcons.length
    )
  ) {
    setTimeout(mapCompact_getDOM, 1000);
  }
}

mapCompact_getDOM();

//
// UI Update Functions

let mapCompact_hidden;

function mapCompact_showMapCompacts(hide = false) {
  if (!hide) {
    // show mapCompact
    lobby_showLeaderboard(true);
    setTimeout(() => {
      for (let i = 0; i < mapCompactElements.length; i++) {
        setTimeout(() => {
          mapCompactElements[i].style.transform = "";
        }, 100 * i);
      }
    }, 1000);
    mapCompact_hidden = false;
  } else {
    // hide mapCompact
    for (let i = 0; i < mapCompactElements.length; i++) {
      setTimeout(() => {
        mapCompactElements[i].style.transform = "translateX(-100%)";
      }, 100 * i);
    }
    mapCompact_hidden = true;
  }
}

function mapCompact_clearMapCompact() {
  for (; mapCompactElements.length > 0; ) {
    mapCompactElements[0].remove();
  }
  mapCompact_getDOM();
}

function mapCompact_regenMapCompacts(currentPhasePicks, element2add2) {
  mapCompact_clearMapCompact();
  fetch("/components/lobby-mapcompact.html")
    .then((response) => response.text())
    .then((text) => {
      for (let i = 0; i < currentPhasePicks.length; i++) {
        element2add2.innerHTML += text;
      }
    });
  mapCompact_getDOM();
}

function mapCompact_updateInfo(teams, currentPhasePicks, lobby) {
  for (let i = 0; i < currentPhasePicks.length; i++) {
    if (currentPhasePicks[i].pick === 1) {
      if (currentPhasePicks[i].team === teams[0].name) {
        mapCompact_pickElements[i].style.backgroundColor = "var(--red)";
      } else if (currentPhasePicks[i].team === teams[1].name) {
        mapCompact_pickElements[i].style.backgroundColor = "var(--blue)";
      } else {
        mapCompact_pickElements[i].style.backgroundColor = "var(--white)";
      }

      mapCompact_codeElements[i].innerText = currentPhasePicks[i].code;

      if (
        (i === 0 || currentPhasePicks[i - 1].win) &&
        !currentPhasePicks[i].win
      ) {
        // current map
        mapCompact_winTextElements[i].style.opacity = 0;
        if (
          lobby.set_scores[0] >= (lobby.bo + 1) / 2 ||
          lobby.set_scores[1] >= (lobby.bo + 1) / 2
        ) {
          // match ended; not going to play this map
          mapCompact_circleElements[i].style.opacity = 0;
          mapCompact_playIcons[i].style.opacity = 0;
        } else {
          // now playing
          mapCompact_circleElements[i].style.backgroundColor = "var(--white)";
          mapCompact_circleElements[i].style.opacity = 1;
          mapCompact_playIcons[i].style.opacity = 1;
        }
      } else {
        if (currentPhasePicks[i].win === teams[0].name) {
          // red win
          mapCompact_winTextElements[i].style.opacity = 1;
          mapCompact_circleElements[i].style.backgroundColor = "var(--red)";
          mapCompact_circleElements[i].style.opacity = 1;
          mapCompact_playIcons[i].style.opacity = 0;
        } else if (currentPhasePicks[i].win === teams[1].name) {
          // blue win
          mapCompact_winTextElements[i].style.opacity = 1;
          mapCompact_circleElements[i].style.backgroundColor = "var(--blue)";
          mapCompact_circleElements[i].style.opacity = 1;
          mapCompact_playIcons[i].style.opacity = 0;
        } else {
          // yet to be played
          mapCompact_winTextElements[i].style.opacity = 0;
          mapCompact_circleElements[i].style.opacity = 0;
          mapCompact_playIcons[i].style.opacity = 0;
        }
      }
    }
  }
}

//
// Update Function

let currentPhasePicks = [];
let tempPhase, tempMatchCode, tempMappoolName;

function mapCompact_updateMapCompact(overlayData, leftBoxElement) {
  let picksOnly = [];

  // check current phase; if no map is picked on phase 2, it's still phase 1
  let phase = overlayData.progress.phase;
  if (phase >= 2) {
    phase--;
    for (
      let i = 0;
      i <
      overlayData.progress.phases[overlayData.progress.phase - 1].order.length;
      i++
    ) {
      if (
        overlayData.progress.phases[overlayData.progress.phase - 1].order[i]
          .pick === 1
      ) {
        phase++;
        break;
      }
    }
  }

  // we only use picks(not bans) here
  overlayData.progress.phases[phase - 1].order.forEach((pick) => {
    if (pick.pick === 1) {
      picksOnly.push(pick);
    }
  });

  // update
  if (
    tempPhase !== phase ||
    tempMatchCode !== overlayData.match_code ||
    tempMappoolName !== overlayData.mappool_name ||
    currentPhasePicks.length !== picksOnly.length
  ) {
    tempPhase = phase;
    tempMatchCode = overlayData.match_code;
    tempMappoolName = overlayData.mappool_name;

    mapCompact_regenMapCompacts(picksOnly, leftBoxElement);
  } else {
    mapCompact_updateInfo(overlayData.teams, picksOnly, overlayData.lobby);
  }
  currentPhasePicks = picksOnly;
}

mapCompact_showMapCompacts(true);
