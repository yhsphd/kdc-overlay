const express = require('express');
const router = express.Router();

const osuapi = require("./osuapi");
router.use("/osuapi", osuapi);

const fb2k = require("./fb2k");
router.use("/fb2k", fb2k);

const drive = require("./spreadsheets");
router.use("/drive", drive);

module.exports = router;