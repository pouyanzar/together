import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import app from "./app";
import User from "./models/userModel";
import { DBconnect } from "./config/mongo";
import dotenv from "dotenv";

dotenv.config();

DBconnect();
app.use(cors());
const PORT: string | number = process.env.PORT ?? 8000;
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });
console.log("starting....");
io.on("connection", (socket) => {
  if (socket) {
    console.log("connected!");
    console.log("me!", socket.id);
    socket.emit("me", socket.id);
  }

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
    const user = async () =>
      await User.findOneAndUpdate(
        { socket_id: socket.id },
        { $set: { socket_id: "" } }
      );
    console.log("disconnected!!!");
    console.log(user);
  });

  socket.on("callUser", (data) => {
    console.log("calling......");
    console.log("user to call: ", data.userToCall);
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
