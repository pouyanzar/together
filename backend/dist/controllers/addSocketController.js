"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSocketId = exports.findUserByEmail = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const findUserByEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    console.log(req.body);
    try {
        // updateSocketId(socketId,email)
        const user = yield userModel_1.default.findOne({ email: email });
        res.json(user);
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.findUserByEmail = findUserByEmail;
const addSocketId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { socketId, email } = req.body;
    console.log(req.body);
    try {
        // updateSocketId(socketId,email)
        const user = yield userModel_1.default.findOneAndUpdate({ email }, { $set: { socket_id: socketId } });
        res.json(user);
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.addSocketId = addSocketId;
