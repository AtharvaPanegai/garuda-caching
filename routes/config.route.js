const express = require("express");
const router = express.Router();

const { configureApiMonitoring } = require("../controllers/config.controller");

// routes
router.route("/config").post(configureApiMonitoring);

module.exports = router;