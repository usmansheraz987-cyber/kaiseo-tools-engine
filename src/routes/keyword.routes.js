import express from "express";
import { keywordDensityController } from "../tools/keywordDensity/controller.js";

const router = express.Router();

router.post("/keyword-density", keywordDensityController);

export default router;
