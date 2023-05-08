exports = module.exports = {
    type: "match",
    match_code: 24,
    bracket: "본선 2주차",
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
        metadata: {
            mapId: 0,
            setId: 0,
            code: "NM1",
            title: "signal flare",
            artist: "森羅万象",
            mapper: "",
            difficulty: ""
        },
        time: {
            position: 100,
            length: 270
        },
        stats: {
            cs: 0,
            ar: 0,
            od: 0,
            hp: 0,
            sr: 0,
            bpm: "",
            modified: {
                cs: 0,
                ar: 0,
                od: 0,
                hp: 0,
                sr: 0,
                bpm: ""
            }
        },
        images: {
            cover: "/api/fb2k/albumart",
            background: ""
        }
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
        maps: {}
    },
    progress: {
        phase: 1,
        phases: [{
            ban: [{
                code: "NM1",
                team: "Team 쩌리들"
            }, {
                code: "DT1",
                team: "네타바레"
            }, {
                code: "FM2",
                team: "Team 쩌리들"
            }, {
                code: "NM2",
                team: "네타바레"
            }],
            pick: [{
                current: false,
                code: "NM3",
                team: "Team 쩌리들",
                win: "Team 쩌리들"
            }, {
                current: true,
                code: "DT2",
                team: "네타바레",
                win: ""
            }, {
                current: false,
                code: "DT3",
                team: "네타바레",
                win: ""
            }, {
                current: false,
                code: "HD2",
                team: "Team 쩌리들",
                win: ""
            }]
        }, {}]
    }
}