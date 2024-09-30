import { Router } from "express";
import {
  getDetailsSales,
  getDetailSale,
  createDetailSale,
  updateDetailSale,
  deleteDetailSale,
} from "../controllers/detailSale.controller.js";

const router = Router();

router.get("/detailsSales", getDetailsSales);
router.get("/detailSale/:id", getDetailSale);
router.post("/detailSale", createDetailSale);
router.put("/detailSale/:id", updateDetailSale);
router.delete("/detailSale/:id", deleteDetailSale);

export default router;
