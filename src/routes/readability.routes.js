// routes/readability.routes.js

const express = require("express");
const router = express.Router();

const {
  readabilityController
} = require("../tools/readability/v1/controller");

// middleware (keep same pattern as your other routes)
// const auth = require("../middleware/auth");
// const usageLimit = require("../middleware/usageLimit");

router.post(
  "/readability",
  // auth,
  // usageLimit,
  readabilityController
);

module.exports = router;
