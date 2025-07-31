const express = require("express");

const { Fb2kApi } = require("./fb2k");
const { OsuApi } = require("./osu");

class Apis {
  constructor(config) {
    this.router = express.Router();

    this.fb2k = new Fb2kApi(config.fb2k);
    this.router.use("/fb2k", this.fb2k.router);

    this.osu = new OsuApi();
    this.router.use("/osu", this.osu.router);
  }
}

exports = module.exports = { Apis };
