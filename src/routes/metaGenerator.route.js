import express from "express";
import { metaGeneratorController } from "../tools/metaGenerator/controller.js";

const router = express.Router();

router.post("/meta-generator", metaGeneratorController);

export default router;
