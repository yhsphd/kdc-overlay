let intro_teams = document.getElementsByClassName("intro-team");

function intro_updateTeams(params) {
    const team1 = params.hasOwnProperty("team1") ? params.team1 : "";
    const team2 = params.hasOwnProperty("team2") ? params.team2 : "";
    const teams = getTeams(team1, team2);

    for (let i = 0; i < 2; i++) {
        intro_teams[i].getElementsByClassName("intro-teamName")[0].innerText = teams[i].hasOwnProperty("teamName") ? teams[i].teamName : "";
        intro_teams[i].getElementsByClassName("acronym")[0].innerText = teams[i].hasOwnProperty("acronym") ? teams[i].acronym : "";

        let pfpElements = intro_teams[i].getElementsByClassName("intro-player-pfp");
        let nickElements = intro_teams[i].getElementsByClassName("intro-player-nick");
        let rankElements = intro_teams[i].getElementsByClassName("intro-player-rank");

        for (let j = 0; j < 2; j++) {
            let playerInfo = getPlayerInfo(teams[i].players[j]);
            pfpElements[j].src = "https://a.ppy.sh/" + teams[i].players[j];
            nickElements[j].innerText = "";
            rankElements[j].innerText = "";
        }

        let teamStatsElements = intro_teams[i].getElementsByClassName("intro-teamStatsBox-value");
        teamStatsElements[0].innerText = "";    // avg. rank
        teamStatsElements[1].innerText = teams[i].seed;    // quals. seeding
    }
}