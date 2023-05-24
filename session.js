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
        name: "100% 오렌지쥬스",
        acronym: "노르마",
        seed: 6,
        players: [{
            id: 7429772,
            nick: "Megii",
            rank: 1314
        }, {
            id: 4637369,
            nick: "Petit",
            rank: 525
        }]
    }, {
        name: "Pain의 오스 교실",
        acronym: "THX",
        seed: 25,
        players: [{
            id: 10776788,
            nick: "[ Momoring ]",
            rank: 51707
        }, {
            id: 1460263,
            nick: "Pain",
            rank: 362
        }]
    }],
    now_playing: {
        mode: "osu",
        osu: require(path.join(__dirname, "templates/map")),
        fb2k: require(path.join(__dirname, "templates/fb2k")),
    },
    intro: {},
    lobby: {
        players: [{
            id: 6665667,
            nick: "yhsphd",
            score: 589332,
            combo: 133,
            acc: 96.72
        }, {
            id: 8991722,
            nick: "Atipir",
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
        bo: 9,
        scores: [0, 0],
        set_scores: [0, 0]
    },
    mappool: {
        NM1: {
            map_id: 4003023,
            mapset_id: 1918243,
            code: 'NM1',
            background: 'https://assets.ppy.sh/beatmaps/1918243/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1918243/covers/cover@2x.jpg?1676240615',
            title: 'Sakebe',
            artist: 'Numakura Manami',
            mapper: 'Andrea',
            difficulty: "browiec & torriru's Nightmare",
            stats: {
                cs: 3.8,
                ar: 9.4,
                od: 9.2,
                hp: 6,
                sr: 6.46,
                bpm: 195,
                length: 242000
            }
        },
        NM2: {
            map_id: 2764088,
            mapset_id: 1247724,
            code: 'NM2',
            background: 'https://assets.ppy.sh/beatmaps/1247724/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1247724/covers/cover@2x.jpg?1614774654',
            title: 'Chronostasis',
            artist: 'Kurokotei',
            mapper: 'knowledgeking',
            difficulty: 'Extra',
            stats: {
                cs: 4,
                ar: 9.4,
                od: 8.7,
                hp: 5.7,
                sr: 6.66,
                bpm: 196,
                length: 133000
            }
        },
        NM3: {
            map_id: 4098658,
            mapset_id: 1974878,
            code: 'NM3',
            background: 'https://assets.ppy.sh/beatmaps/1974878/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1974878/covers/cover@2x.jpg?1682362763',
            title: 'Idol',
            artist: 'YOASOBI',
            mapper: 'iljaaz',
            difficulty: 'My Idol Kana',
            stats: {
                cs: 4,
                ar: 9.4,
                od: 8.4,
                hp: 6,
                sr: 5.96,
                bpm: 166,
                length: 210000
            }
        },
        NM4: {
            map_id: 3276740,
            mapset_id: 1604642,
            code: 'NM4',
            background: 'https://assets.ppy.sh/beatmaps/1604642/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1604642/covers/cover@2x.jpg?1636927274',
            title: 'Be With U',
            artist: 'F Rabbeat',
            mapper: 'Altai',
            difficulty: "Don't Just Stand There...",
            stats: {
                cs: 4,
                ar: 9.3,
                od: 8.5,
                hp: 6,
                sr: 6.14,
                bpm: 175,
                length: 133000
            }
        },
        NM5: {
            map_id: 2933401,
            mapset_id: 707703,
            code: 'NM5',
            background: 'https://assets.ppy.sh/beatmaps/707703/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/707703/covers/cover@2x.jpg?1622130031',
            title: '[Nexus]',
            artist: 'mafumafu',
            mapper: 'William K',
            difficulty: 'Extra: Sliders',
            stats: {
                cs: 3.8,
                ar: 8,
                od: 8,
                hp: 5,
                sr: 4.98,
                bpm: 150,
                length: 107000
            }
        },
        HD1: {
            map_id: 3276559,
            mapset_id: 1604543,
            code: 'HD1',
            background: 'https://assets.ppy.sh/beatmaps/1604543/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1604543/covers/cover@2x.jpg?1636920089',
            title: 'Bubble Flower',
            artist: 'Sound Souler',
            mapper: 'Keqing',
            difficulty: 'Serenity',
            stats: {
                cs: 4.3,
                ar: 9.2,
                od: 8.7,
                hp: 6,
                sr: 5.99,
                bpm: 192,
                length: 139000
            }
        },
        HD2: {
            map_id: 3914449,
            mapset_id: 1899133,
            code: 'HD2',
            background: 'https://assets.ppy.sh/beatmaps/1899133/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1899133/covers/cover@2x.jpg?1672857037',
            title: 'sabotage',
            artist: 'Ryokuoushoku Shakai',
            mapper: 'Heilia',
            difficulty: 'Shiny Moments',
            stats: {
                cs: 3.8,
                ar: 8,
                od: 8,
                hp: 6,
                sr: 5.23,
                bpm: 162,
                length: 229000
            }
        },
        HR1: {
            map_id: 3939649,
            mapset_id: 1910004,
            code: 'HR1',
            background: 'https://assets.ppy.sh/beatmaps/1910004/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1910004/covers/cover@2x.jpg?1677907349',
            title: 'Love Song ga Utaenai',
            artist: 'kessoku band',
            mapper: 'pnky',
            difficulty: 'Loneliness',
            stats: {
                cs: 3.8,
                ar: 9.4,
                od: 9,
                hp: 6,
                sr: 6.19,
                bpm: 185,
                length: 184000
            }
        },
        HR2: {
            map_id: 1704329,
            mapset_id: 812551,
            code: 'HR2',
            background: 'https://assets.ppy.sh/beatmaps/812551/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/812551/covers/cover@2x.jpg?1622143476',
            title: 'Axium Crisis',
            artist: 'ak+q',
            mapper: 'MrSergio',
            difficulty: 'Collapse',
            stats: {
                cs: 5,
                ar: 9,
                od: 8.2,
                hp: 6,
                sr: 5.59,
                bpm: 170,
                length: 145000
            }
        },
        DT1: {
            map_id: 3277407,
            mapset_id: 1604973,
            code: 'DT1',
            background: 'https://assets.ppy.sh/beatmaps/1604973/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1604973/covers/cover@2x.jpg?1635909111',
            title: 'Kiritorisen',
            artist: 'chano & 40mP',
            mapper: 'Amateurre',
            difficulty: 'Boundary',
            stats: {
                cs: 4,
                ar: 8.8,
                od: 8,
                hp: 5,
                sr: 4.72,
                bpm: 165,
                length: 231000
            }
        },
        DT2: {
            map_id: 4115627,
            mapset_id: 1981952,
            code: 'DT2',
            background: 'https://assets.ppy.sh/beatmaps/1981952/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1981952/covers/cover@2x.jpg?1682516550',
            title: 'Ki no Bou',
            artist: '-45',
            mapper: 'Down',
            difficulty: 'Insane',
            stats: {cs: 4, ar: 8, od: 8, hp: 5, sr: 4.58, bpm: 155, length: 261000}
        },
        DT3: {
            map_id: 2944586,
            mapset_id: 1430387,
            code: 'DT3',
            background: 'https://assets.ppy.sh/beatmaps/1430387/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1430387/covers/cover@2x.jpg?1622209080',
            title: 'Calc.',
            artist: 'chelly',
            mapper: 'CoLouRed GlaZeE',
            difficulty: "Delis' Insane '17",
            stats: {cs: 4, ar: 8, od: 7, hp: 7, sr: 4.81, bpm: 173, length: 202000}
        },
        FM1: {
            map_id: 3287758,
            mapset_id: 1610224,
            code: 'FM1',
            background: 'https://assets.ppy.sh/beatmaps/1610224/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1610224/covers/cover@2x.jpg?1645287563',
            title: 'Aoi Chou',
            artist: 'Sougetsu Eli',
            mapper: 'Ryuusei Aika',
            difficulty: 'Transient',
            stats: {
                cs: 3.5,
                ar: 9,
                od: 9,
                hp: 6.5,
                sr: 6.58,
                bpm: 182,
                length: 205000
            }
        },
        FM2: {
            map_id: 95954,
            mapset_id: 16990,
            code: 'FM2',
            background: 'https://assets.ppy.sh/beatmaps/16990/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/16990/covers/cover@2x.jpg?1622036813',
            title: 'Yakujinsama no Couple Dance',
            artist: 'O-Life Japan',
            mapper: 'AngelHoney',
            difficulty: 'Lunatic',
            stats: {cs: 5, ar: 8, od: 7, hp: 7, sr: 6.17, bpm: 192, length: 125000}
        },
        FcM1: {
            map_id: 2489835,
            mapset_id: 1195222,
            code: 'FcM1',
            background: 'https://assets.ppy.sh/beatmaps/1195222/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1195222/covers/cover@2x.jpg?1622191700',
            title: 'Amrita feat. Baru',
            artist: 'An',
            mapper: '-Tochi',
            difficulty: 'Immortality',
            stats: {
                cs: 3.8,
                ar: 9.4,
                od: 8.8,
                hp: 5.5,
                sr: 6.36,
                bpm: 200,
                length: 273000
            }
        },
        FcM2: {
            map_id: 2519013,
            mapset_id: 1209920,
            code: 'FcM2',
            background: 'https://assets.ppy.sh/beatmaps/1209920/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1209920/covers/cover@2x.jpg?1650700012',
            title: 'Mela!',
            artist: 'Ryokuoushoku Shakai',
            mapper: 'Battle',
            difficulty: 'Hero!',
            stats: {
                cs: 3,
                ar: 9.2,
                od: 8.7,
                hp: 6,
                sr: 5.61,
                bpm: 138,
                length: 239000
            }
        },
        TB: {
            map_id: 3815421,
            mapset_id: 1856477,
            code: 'TB',
            background: 'https://assets.ppy.sh/beatmaps/1856477/covers/raw.jpg',
            cover: 'https://assets.ppy.sh/beatmaps/1856477/covers/cover@2x.jpg?1674753627',
            title: 'Fata Morgana',
            artist: 'Yousei Teikoku',
            mapper: 'kowari',
            difficulty: 'Despair',
            stats: {
                cs: 4,
                ar: 9.5,
                od: 9,
                hp: 6,
                sr: 6.88,
                bpm: 200,
                length: 346000
            }
        }
    },
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