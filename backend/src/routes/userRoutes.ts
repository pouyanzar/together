/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { getAllUsers } from "../controllers/userController";
import {
  signup,
  login,
  protect,
  restrictTo,
} from "../controllers/authController";
const router = express.Router();

// http://localhost:8000/signup

router.post("/signup", signup);
router.post("/login", login);
// router.post("/newUser", newUser);
router.route("/").get(protect, restrictTo("admin"), getAllUsers);
router.route("/:id");

export default router;
