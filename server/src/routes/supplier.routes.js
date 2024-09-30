import { Router } from "express";
import {
  getSuppliers,
  getSupplier,
  createSuppliers,
  updateSuppliers,
  deleteSuppliers,
} from "../controllers/supplier.controllers.js";

const router = Router();

router.get("/suppliers", getSuppliers);
router.get("/supplier/:id", getSupplier);
router.post("/supplier", createSuppliers);
router.put("/supplier/:id", updateSuppliers);
router.delete("/supplier/:id", deleteSuppliers);

export default router;
