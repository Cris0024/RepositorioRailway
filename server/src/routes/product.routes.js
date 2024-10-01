import { Router } from "express";
import {
  getProducts,
  getProductsActive,
  getProduct,
  getProductCategory,
  createProducts,
  updateProducts,
  deleteProducts,
} from "../controllers/product.controllers.js";

const router = Router();

router.get("/productsAll", getProducts);
router.get("/products", getProductsActive);
router.get("/product/:id", getProduct);
router.get("/product/category/:id",getProductCategory);
router.post("/product", createProducts);
router.put("/product/:id", updateProducts);
router.delete("/product/:id", deleteProducts);

export default router;
