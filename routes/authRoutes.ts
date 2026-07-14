import { Router } from "express";

import {
  login,
  logout,
  register,
  verify,
} from "../controllers/authController";

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
router.get("/verify", authMiddleware, verify);

router.post("/logout", authMiddleware, logout);

export default router;