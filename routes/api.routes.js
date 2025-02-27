const express = require("express");
const router = express.Router();

const { Monitorapi } = require("../controllers/api.controller");

// routes
router.route("/monitorapi").post(Monitorapi);

module.exports = router;