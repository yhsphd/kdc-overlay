const express = require("express");
const router = express.Router();

exports = module.exports = function (config) {
  const fb2k = require("./fb2k")(config);
  router.use("/fb2k", fb2k);

  return router;
};
