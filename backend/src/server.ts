import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import app from "./app";
import { DBconnect } from "./config/mongo";
import dotenv from "dotenv";

dotenv.config();

DBconnect();
app.use(cors());
const PORT: string | number = process.env.PORT ?? 8000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
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
