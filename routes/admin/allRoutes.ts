import { Router } from "express";

import { users, verify } from "../../controllers/userController";
import { Files } from "../../controllers/filesController";
import { getNewsletters, approveNewsletter, rejectNewsletter , togglePublish} from "../../controllers/newsletterController";

import { authMiddleware } from "../../middleware/authMiddleware";
import { adminAuthMiddleware } from "../../middleware/adminauth";

const router = Router();

router.get("/users", authMiddleware, adminAuthMiddleware, users);

router.get("/users/files", authMiddleware, adminAuthMiddleware, Files);

router.get("/newsletters", authMiddleware, adminAuthMiddleware, getNewsletters);

router.patch("/newsletter/:id/approve", authMiddleware, adminAuthMiddleware, approveNewsletter);

router.patch("/newsletter/:id/reject", authMiddleware, adminAuthMiddleware, rejectNewsletter);

router.patch("/newsletter/:id/publish", authMiddleware, adminAuthMiddleware, togglePublish);

router.patch("/user/:id/verify", authMiddleware, adminAuthMiddleware, verify);

export default router;