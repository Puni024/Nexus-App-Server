import { Router } from "express";

import {
  login,
  logout,
  register,
  verifyController,
  updateProfile,
  last_visit,
} from "../controllers/authController";
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

router.patch('/heartbeat',authMiddleware,last_visit)

export default router;