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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const userModel_1 = __importDefault(require("./models/userModel"));
const mongo_1 = require("./config/mongo");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, mongo_1.DBconnect)();
app_1.default.use((0, cors_1.default)());
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const server = http_1.default.createServer(app_1.default);
exports.io = new socket_io_1.Server(server, { cors: { origin: "*" } });
console.log("starting....");
exports.io.on("connection", (socket) => {
    if (socket) {
        console.log("connected!");
        console.log("me!", socket.id);
        socket.emit("me", socket.id);
    }
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
        const user = () => __awaiter(void 0, void 0, void 0, function* () {
            return yield userModel_1.default.findOneAndUpdate({ socket_id: socket.id }, { $set: { socket_id: "" } });
        });
        console.log("disconnected!!!");
        console.log(user);
    });
    socket.on("callUser", (data) => {
        console.log("calling......");
        console.log("user to call: ", data.userToCall);
        exports.io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });
    socket.on("answerCall", (data) => {
        console.log("answered", data.to);
        exports.io.to(data.to).emit("callAccepted", data.signal);
    });
});
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
