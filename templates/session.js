path = require("path");

exports = module.exports = {
    type: "",
    match_code: 0,
    bracket: "0",
    bo: 0,
    stream_title: "",
    schedule: "2023-04-05T16:00:00+09:00",
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
        mode: "",
        osu: require(path.join(__dirname, "map")),
        fb2k: require(path.join(__dirname, "fb2k")),
    },
    intro: {},
    lobby: {},
    mappool: {},
    progress: {
        phase: 1,
        phases: [{
            first_pick: "",
            order: [
                // require(path.join(__dirname, "banpick"))
            ]
        }, {
            first_pick: "",
            order: []
        }]
    },
    chat: {}
}