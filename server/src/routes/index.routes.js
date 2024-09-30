import { Router } from "express";
import { pool } from "../db.js";
import { ping, server } from "../controllers/index.controllers.js";

const router = Router()

router.get("/ping", ping);

router.get("/", server);

export default router