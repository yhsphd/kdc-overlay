const express = require('express');
const router = express.Router();

const osuapi = require("./osuapi");
router.use("/osuapi", osuapi);

const fb2k = require("./fb2k");
router.use("/fb2k", fb2k);

module.exports = router;