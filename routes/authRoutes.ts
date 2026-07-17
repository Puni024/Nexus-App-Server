import { Router } from "express";

import {
  login,
  logout,
  register,
  verify,
} from "../controllers/authController";
import { users } from "../controllers/userController";

import { googleLogin } from "../controllers/googleController";

import { authMiddleware } from "../middleware/authMiddleware";
import { adminAuthMiddleware } from "../middleware/adminauth";

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

router.get("/users", authMiddleware, adminAuthMiddleware, users);

router.post("/logout", authMiddleware, logout);

export default router;