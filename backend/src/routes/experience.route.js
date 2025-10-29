import express from "express";
import { addExperince } from "../controllers/experience.controller.js";

const router = express.Router();

// Create a new experience
router.post("/add-experince", addExperince);

export default router;