const express = require("express");
const router = express.Router();

const { decideSeoAction } = require("../decisionEngine/controllers/decision.controller");

router.post("/decide", decideSeoAction);

module.exports = router;
