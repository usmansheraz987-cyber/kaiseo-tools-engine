// src/routes/readability.routes.js

import express from "express";
import { readabilityController } from "../tools/readability/v1/controller.js";

const router = express.Router();

router.post("/readability", readabilityController);

export default router;
