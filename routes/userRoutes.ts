import { Router } from "express";
import { verifyGoogleToken } from "../controllers/googleController";

const router = Router();

router.post("/google/login", verifyGoogleToken);

export default router;