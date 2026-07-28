import { Router } from "express";

import { users, verify } from "../../controllers/userController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { adminAuthMiddleware } from "../../middleware/adminauth";

const router = Router();

router.get("/users", authMiddleware, adminAuthMiddleware, users);

router.patch("/:id/verify", authMiddleware, adminAuthMiddleware, verify);

export default router;