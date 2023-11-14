import express from "express";

import {
  forgotPasswordController,
  loginController,
  registerController,
  testController,
} from "../controller/authController.js";

import { isAdmin, requireSingIn } from "../middleware/authMiddleware.js";

const router = express.Router();

// register routes
router.post("/register", registerController);

// forgot password routes
router.post("/forgot-password", forgotPasswordController);

// login routes
router.post("/login", loginController);

// test routes in middleware
router.get("/test", requireSingIn, isAdmin, testController);

// protected routes for user
router.get("/user-auth", requireSingIn, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

// protected routes for admin
router.get("/admin-auth", requireSingIn, isAdmin, (req, res) => {
  res.status(200).send({
    ok: true,
  });
});

export default router;
