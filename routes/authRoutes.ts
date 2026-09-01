import { Router } from "express";
import upload from "../middleware/upload";

import {
  login,
  logout,
  register,
  verifyController,
  updateProfile,
  refresh,
  // last_visit,
} from "../controllers/authController";

import { nl_contribution, nl_contribution_details, published_nl } from "../controllers/newsletterController";

import { users } from "../controllers/userController";

import { googleLogin } from "../controllers/googleController";

import { authMiddleware } from "../middleware/authMiddleware";
import { streamFile } from "../controllers/fileStreamController";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

router.post("/refresh", refresh);

// Protected Routes

router.get("/verify", authMiddleware, verifyController);

router.get("/users", authMiddleware, users);

router.post("/logout", authMiddleware, logout);

router.patch("/user/updateprofile", authMiddleware, updateProfile);

// router.patch('/heartbeat',authMiddleware,last_visit);


//Newsletter Routes

router.get('/newsletters',authMiddleware,nl_contribution_details);

router.get('/newsletters/published',authMiddleware,published_nl);

router.post('/newsletter/contribute',authMiddleware, upload.single("file"),nl_contribution);


//files
router.get("/files/:file_id/stream", authMiddleware, streamFile);


export default router;