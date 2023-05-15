const path = require("path");

path = require("path");

exports = module.exports = {
    type: "match",
    match_code: 24,
    bracket: "본선 2주차",
    bo: 9,
    stream_title: "KDC Streamkit 큰거온다",
    schedule: "2023-04-09T16:00:00+09:00",
    teams: [{
        name: "Team 쩌리들",
        acronym: "쩌리들",
        seed: 2,
        players: [{
            id: 6665667,
            nick: "yhsphd",
            rank: 13287
        }, {
            id: 1076236,
            nick: "ToGlette",
            rank: 8536
        }]
    }, {
        name: "네타바레",
        acronym: "적폐",
        seed: "1",
        players: [{
            id: 6537257,
            nick: "KitaShia",
            rank: 15562
        }, {
            id: 4585186,
            nick: "Nopekjk",
            rank: 1002
        }]
    }],
    now_playing: {
        mode: "fb2k",
        time: 0,
        osu: require(path.join(__dirname, "templates/map")),
        fb2k: require(path.join(__dirname, "templates/fb2k")),
    },
    intro: {},
    lobby: [{
        id: 6665667,
        nick: "yhsphd",
        score: 589332,
        combo: 133,
        acc: 96.72
    }, {
        id: 1076236,
        nick: "ToGlette",
        score: 755235,
        combo: 133,
        acc: 96.72
    }, {
        id: 6537257,
        nick: "KitaShia",
        score: 433423,
        combo: 133,
        acc: 96.72
    }, {
        id: 4585186,
        nick: "Nopekjk",
        score: 955543,
        combo: 133,
        acc: 96.72
    }],
    mappool: {
        maps: []
    },
    progress: {
        phase: 1,
        phases: [{
            first_pick: "Team 쩌리들",
            order: [
                {
                    code: "",
                    team: "",
                    pick: true,    // false: ban
                    map: require(path.join(__dirname, "map"))
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
    }
}