import express from "express";
import { addExperince,getExperince_detail,getExperince } from "../controllers/experience.controller.js";

const router = express.Router();

router.post("/add-experince", addExperince);
router.get('/get-experince-detail',getExperince_detail)
router.get('/get-experince',getExperince)

export default router;