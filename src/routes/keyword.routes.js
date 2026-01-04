import express from "express";

// v1 controller
import { keywordDensityController } from "../tools/keywordDensity/controller.js";

// v2 controller
import { keywordDensityV2Controller } from "../tools/keywordDensity/v2/controller.js";

const router = express.Router();

// v1 route (unchanged)
router.post("/keyword-density", keywordDensityController);

// v2 route (new)
router.post("/keyword-density/v2", keywordDensityV2Controller);

export default router;
