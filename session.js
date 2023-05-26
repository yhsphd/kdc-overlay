const path = require("path");

exports = module.exports = {
    type: "match",
    match_code: 2,
    bracket: "예선 1주차",
    mappool_name: "",
    bo: 9,
    stream_title: "예선 맵풀 쇼케이스",
    schedule: "2023-05-21T01:00:00+09:00",
    teams: [{
        name: "",
        acronym: "",
        seed: 0,
        set_score: 0,
        score: 0,
        players: [{
            id: 0,
            nick: "",
            rank: 0
        }, {
            id: 0,
            nick: "",
            rank: 0
        }]
    }, {
        name: "",
        acronym: "",
        seed: 0,
        set_score: 0,
        score: 0,
        players: [{
            id: 0,
            nick: "",
            rank: 0
        }, {
            id: 0,
            nick: "",
            rank: 0
        }]
    }],
    now_playing: {
        mode: "osu",
        osu: require(path.join(__dirname, "templates/map")),
        fb2k: require(path.join(__dirname, "templates/fb2k")),
    },
    intro: {},
    lobby: {
        players: [{id: 0, nick: "", acc: 0, combo: 0, score: 0},{id: 0, nick: "", acc: 0, combo: 0, score: 0},
        {id: 0, nick: "", acc: 0, combo: 0, score: 0},{id: 0, nick: "", acc: 0, combo: 0, score: 0}],
        bo: 0,
        scores: [0, 0],
        set_scores: [0, 0]
    },
    mappool: {},
    progress: {
        phase: 1,
        state: 0,
        phases: [{
            first_pick: "Team 쩌리들",
            order: [
                {
                    code: "",
                    team: "",
                    pick: true,    // false: ban
                    map: require(path.join(__dirname, "templates/map")),
                    current: true
                },
                require(path.join(__dirname, "templates/banpick")),
                require(path.join(__dirname, "templates/banpick")),
                require(path.join(__dirname, "templates/banpick")),
                require(path.join(__dirname, "templates/banpick")),
                require(path.join(__dirname, "templates/banpick"))
            ]
        }, {
            first_pick: "네타바레",
            order: []
        }]
    },
    chat: []
}