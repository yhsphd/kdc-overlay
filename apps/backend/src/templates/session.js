exports = module.exports = {
  type: "",
  match_code: "",
  bracket: "0",
  mappool_name: "",
  mappool_manual: false,
  bo: 0,
  stream_title: "",
  schedule: "2023-04-05T16:00:00+09:00",
  teams: [
    {
      name: "",
      acronym: "",
      seed: 0,
      players: [
        {
          id: 0,
          nick: "",
          rank: 0,
        },
        {
          id: 0,
          nick: "",
          rank: 0,
        },
      ],
    },
    {
      name: "",
      acronym: "",
      seed: 0,
      players: [
        {
          id: 0,
          nick: "",
          rank: 0,
        },
        {
          id: 0,
          nick: "",
          rank: 0,
        },
      ],
    },
  ],
  now_playing: {
    mode: "",
    osu: require("./map"),
    fb2k: require("./fb2k"),
  },
  lobby: {
    players: [],
    bo: 0,
    aspect: 1,
    scores: [0, 0],
    set_scores: [0, 0],
  },
  mappool: [],
  progress: {
    phase: "",
    curmap: 0,
    phases: [
      {
        label: "",
        order: [],
      },
    ],
  },
  chat: [],
  CSL: {
    people: {},
    teams: [],
    matches: {},
  },
};
