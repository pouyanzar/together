"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const mongo_1 = require("./config/mongo");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, mongo_1.DBconnect)();
app_1.default.use((0, cors_1.default)());
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
// let users: { [key: string]: string }[] = [];
console.log("starting....");
io.on("connection", (socket) => {
    console.log("connected!");
    socket.emit("me", socket.id);
    // socket.on("me", (user) => {
    // });
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
        // for (const user of users) {
        //   if (Object.values(user)[0] == socket.id) {
        //     users.splice(users.indexOf(user, 1));
        //   }
        // }
        console.log("disconnected!!!", socket.id);
        // console.log(users);
    });
    socket.on("callUser", (data) => {
        console.log("calling......");
        // console.log(users);
        // findUserByEmail(data.userToCall).then((user) => {
        console.log("user to call: ", data.userToCall);
        //   if (user) {
        //     const userSocketId = user.socket_id;
        //     if (userSocketId) {
        io.to(data.userToCall).emit("callUser", {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });
    socket.on("answerCall", (data) => {
        console.log("answered", data.to);
        io.to(data.to).emit("callAccepted", data.signal);
    });
});
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
