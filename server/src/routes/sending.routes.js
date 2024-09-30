import { Router } from "express";
import { getSendings,getSending,createSending,updateSending,deleteSending } from "../controllers/sending.controller.js";

const router = Router();

router.get("/sendings", getSendings);
router.get("/sending/:id", getSending);
router.post("/sending", createSending);
router.put("/sending/:id", updateSending);
router.delete("/sending/:id", deleteSending);

export default router;
