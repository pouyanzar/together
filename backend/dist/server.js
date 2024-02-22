"use strict";
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
const mongo_1 = require("./config/mongo");
const dotenv_1 = __importDefault(require("dotenv"));
const disconnector_1 = __importDefault(require("./helpsers/disconnector"));
dotenv_1.default.config();
(0, mongo_1.DBconnect)();
app_1.default.use((0, cors_1.default)());
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const server = http_1.default.createServer(app_1.default);
exports.io = new socket_io_1.Server(server, { cors: { origin: "*" } });
exports.io.on("connection", (socket) => {
    if (socket) {
        socket.emit("me", socket.id);
    }
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
        (0, disconnector_1.default)(socket.id);
    });
    socket.on("callUser", (data) => {
        exports.io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });
    socket.on("answerCall", (data) => {
        exports.io.to(data.to).emit("callAccepted", data.signal);
    });
});
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
