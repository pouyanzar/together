import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import app from "./app";
import { DBconnect } from "./config/mongo";
import dotenv from "dotenv";
dotenv.config();
// const app = express();

// app.use(express.static("public"));

DBconnect();
app.use(cors());
const PORT: string | number = process.env.PORT ?? 8000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
let users: { [key: string]: string }[] = [];
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
