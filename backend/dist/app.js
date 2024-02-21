"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// MIDDLEWARES
app.use(express_1.default.json({ limit: "10kb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10kb" }));
app.use((0, cors_1.default)());
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
app.use((0, cookie_session_1.default)({
    name: "session",
    keys: ['email', 'passowrd']
}));
app.use((req, res, next) => {
    console.log("Hello from the middleware 👋");
    next();
});
// ROUTES
// app.use('/api/v1/books', bookRouter)
app.use("/api/v1/", userRoutes_1.default);
//
// app.get("/", (req, res) => {
//   res.status(200).send("Welcome to Our Express Server!!!!");
// });
exports.default = app;
