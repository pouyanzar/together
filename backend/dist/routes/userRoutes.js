"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-misused-promises */
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// http://localhost:8000/signup
router.post("/signup", authController_1.signup);
router.post("/login", authController_1.login);
// router.post("/newUser", newUser);
router.route("/").get(authController_1.protect, (0, authController_1.restrictTo)("admin"), userController_1.getAllUsers);
router.route("/:id");
exports.default = router;
