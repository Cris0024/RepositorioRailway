import { Router } from "express";
import { createVenta, getVentas, getVenta, updateEstadoEnvio } from "../controllers/sales.controllers.js";
const router = Router();

router.post('/ventas', createVenta);
router.get('/ventas', getVentas); 
router.get('/ventas/:id', getVenta);
router.put('/ventas/:id/estado', updateEstadoEnvio);

export default router;
