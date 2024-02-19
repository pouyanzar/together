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
// const app = express();
// app.use(express.static("public"));
(0, mongo_1.DBconnect)();
app_1.default.use((0, cors_1.default)());
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, { cors: { origin: "*" } });
let users = [];
io.on("connection", (socket) => {
    socket.emit("me", socket.id);
    socket.on("me", (user) => {
        users.push(user);
    });
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
        for (const user of users) {
            if (Object.values(user)[0] == socket.id) {
                users.splice(users.indexOf(user, 1));
            }
        }
        console.log("disconnected!!!", socket.id);
        console.log(users);
    });
    socket.on("callUser", (data) => {
        console.log("calling......");
        console.log(users);
        for (const user of users) {
            console.log("looking......");
            if (data.userToCall === Object.keys(user)[0]) {
                console.log("found one");
                // let id = user[data.userToCall];
                console.log(user[data.userToCall]);
                console.log(data.from);
                io.to(user[data.userToCall]).emit("callUser", {
                    signal: data.signalData,
                    from: data.from,
                    name: data.name,
                });
            }
            break;
        }
    });
    socket.on("answerCall", (data) => {
        console.log("answered");
        io.to(data.to).emit("callAccepted", data.signal);
    });
});
// console.log(users);
server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
