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
        .catch(() => {
          res.status(500).json({ error: "Internal server error" });
        });
    });

    this.router.get("/users", (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      const userIds = JSON.parse(req.query.ids);
      if (!userIds) {
        return res.status(400).json({ error: "User IDs is required" });
      }

      Promise.resolve()
        .then(async () => {
          try {
            const playerdata = await v2.users.list({
              ids: userIds,
              include_variants: false
            });
            res.json(playerdata);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        })
        .catch(() => {
          res.status(500).json({ error: "Internal server error" });
        });
    });

    this.router.get("/beatmap", (req, res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

      const beatmapId = req.query.id;
      if (!beatmapId) {
        return res.status(400).json({ error: "Beatmap ID is required" });
      }

      Promise.resolve()
        .then(async () => {
          try {
            const mapData = await v2.beatmaps.details({
              type: "difficulty",
              id: beatmapId,
            });
            res.json(mapData);
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        })
        .catch(() => {
          res.status(500).json({ error: "Internal server error" });
        });
    });
  }
}

exports = module.exports = { OsuApi };
