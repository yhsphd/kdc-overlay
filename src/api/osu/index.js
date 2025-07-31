const express = require("express");
const { v2 } = require("osu-api-extended");

class OsuApi {
  constructor() {
    this.router = express.Router();

    this.setup();
  }

  setup() {
    this.router.get("/user", (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      const userId = req.query.id;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      Promise.resolve()
        .then(async () => {
          try {
            const playerdata = await v2.users.details({
              user: parseInt(userId),
              mode: "mania",
              key: "id",
            });
            res.json(playerdata);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        })
        .catch((e) => {
          res.status(500).json({ error: "Internal server error" });
        });
    });
  }
}

exports = module.exports = { OsuApi };
