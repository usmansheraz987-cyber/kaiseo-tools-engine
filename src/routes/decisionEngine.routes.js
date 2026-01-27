import express from "express";
import { decideSeoAction } from "../decisionEngine/controllers/decision.controller.js";

const router = express.Router();

router.post("/decision-engine/decide", decideSeoAction);

export default router;
