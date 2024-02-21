import express from "express";
import morgan from "morgan";
import cookieSession from "cookie-session";
import userRouter from "./routes/userRoutes";
import cors from "cors";
const app = express();

// MIDDLEWARES
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(cookieSession({
  name: "session",
  keys: ['email', 'passowrd']
}));
app.use((req, res, next) => {
  console.log("Hello from the middleware 👋");
  next();
});

// ROUTES
// app.use('/api/v1/books', bookRouter)
app.use("/api/v1/", userRouter);
//
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to Our Express Server!!!!");
// });

export default app;
