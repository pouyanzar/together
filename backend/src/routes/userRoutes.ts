/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import {
  addSocketId,
  findUserByEmail,
} from "../controllers/addSocketController";
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
router.patch("/add-socket-id", addSocketId);
router.post("/find-user-by-email", findUserByEmail);
router.route("/:id");

export default router;
