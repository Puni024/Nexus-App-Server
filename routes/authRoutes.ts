import { Router } from "express";
import upload from "../middleware/upload";

import {
  login,
  logout,
  register,
  verifyController,
  updateProfile,
  last_visit,
} from "../controllers/authController";

import { nl_contribution, nl_contribution_details } from "../controllers/newsletterController";

import { users } from "../controllers/userController";

import { googleLogin } from "../controllers/googleController";

import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.post("/register", register);

router.post("/login", login);

router.post("/google", googleLogin);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/
router.get("/verify", authMiddleware, verifyController);

router.get("/users", authMiddleware, users);

router.post("/logout", authMiddleware, logout);

router.patch("/user/updateprofile", authMiddleware, updateProfile);

router.patch('/heartbeat',authMiddleware,last_visit);


//Newsletter Routes

router.get('/newsletters',authMiddleware,nl_contribution_details);

router.post('/newsletter/contribute',authMiddleware, upload.single("file"),nl_contribution);


export default router;