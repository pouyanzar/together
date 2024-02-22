import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import app from "./app";
import { DBconnect } from "./config/mongo";
import dotenv from "dotenv";
import disconnector from "./helpsers/disconnector";

dotenv.config();
DBconnect();
app.use(cors());

const PORT: string | number = process.env.PORT ?? 8000;
const server = http.createServer(app);
export const io = new Server(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  if (socket) {
    socket.emit("me", socket.id);
  }

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
    disconnector(socket.id);
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("callUser", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));
