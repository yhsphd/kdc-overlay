exports = module.exports = {
  type: "",
  match_code: "",
  bracket: "0",
  brackets: [],
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
          country_code: "",
        },
        {
          id: 0,
          nick: "",
          rank: 0,
          country_code: "",
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
          country_code: "",
        },
        {
          id: 0,
          nick: "",
          rank: 0,
          country_code: "",
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
    bo: 1,
    aspect: 1,
    scores: [0, 0],
    set_scores: [0, 0],
  },
  mappool: [],
  progress: {},
  chat: [],
  extended: {
    people: {},
    teams: [],
    matches: {},
    quals: [],
  },
};
