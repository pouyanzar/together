"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const addSocketController_1 = require("../controllers/addSocketController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// http://localhost:8000/signup
router.post("/signup", authController_1.signup);
router.post("/login", authController_1.login);
router.patch("/add-socket-id", addSocketController_1.addSocketId);
router.post("/find-user-by-email", addSocketController_1.findUserByEmail);
router.route("/:id");
exports.default = router;
