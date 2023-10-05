let intro_teams = document.getElementsByClassName("intro-team");
let intro_matchID = document.getElementsByClassName("intro-matchID")[0];

//
// UI Update Functions

function intro_updateTeams(teams) {
  for (let i = 0; i < 2; i++) {
    intro_teams[i].getElementsByClassName("intro-teamName")[0].innerText =
      teams[i].name;
    intro_teams[i].getElementsByClassName("acronym")[0].innerText =
      teams[i].acronym;

    let pfpElements = intro_teams[i].getElementsByClassName("intro-player-pfp");
    let nickElements =
      intro_teams[i].getElementsByClassName("intro-player-nick");
    let rankElements =
      intro_teams[i].getElementsByClassName("intro-player-rank");

    for (let j = 0; j < 2; j++) {
      pfpElements[j].src = "https://a.ppy.sh/" + teams[i].players[j].id;
      nickElements[j].innerText = teams[i].players[j].nick;
      rankElements[j].innerText = "#" + teams[i].players[j].rank;
    }

    textFit(nickElements, { maxFontSize: 32 });

    let teamStatsElements = intro_teams[i].getElementsByClassName(
      "intro-teamStatsBox-value"
    );
    teamStatsElements[0].innerText =
      "#" +
      Math.round((teams[i].players[0].rank + teams[i].players[1].rank) / 2);
    teamStatsElements[1].innerText = "#" + teams[i].seed;
  }
}

function intro_updateMatchID(bracket, id) {
  intro_matchID.innerText = bracket + " / Match " + id;
}

//
// Update Function

function intro_match_update() {
  intro_updateTeams(overlayData.teams);
  intro_updateMatchID(overlayData.bracket, overlayData.match_code);
}

setInterval(intro_match_update, 1000);
