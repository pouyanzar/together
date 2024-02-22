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
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let isAuthenticated = false;
const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = process.env.JWT_EXPIRES_IN;
const JWT_COOKIE_EXPIRES_IN = Number(process.env.JWT_COOKIE_EXPIRES_IN);
if (!JWT_SECRET || !EXPIRES_IN || !JWT_COOKIE_EXPIRES_IN) {
    throw new Error("JWT is not defined in the environment");
}
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, {
        expiresIn: EXPIRES_IN,
    });
};
const createSendToken = (user, statusCode, isAuthenticated, res) => {
    // @ts-expect-error
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };
    if (process.env.NODE_ENV === "production")
        cookieOptions.secure = true;
    res.cookie("jwt", token, cookieOptions);
    // Remove password from output
    // @ts-expect-error
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
            isAuthenticated,
        },
    });
};
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield userModel_1.default.create({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });
        // @ts-expect-error
        createSendToken(newUser, 201, res);
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.signup = signup;
// @ts-expect-error
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide email and password!",
            });
        }
        // 2) Check if user exists && password is correct (selects the user password from DB)
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        // @ts-expect-error
        if (!user || !(yield user.correctPassword(password, user.password))) {
            return res.status(401).json({
                status: "fail",
                message: "Incorrect email or password",
            });
        }
        isAuthenticated = true;
        // 3) If everything ok, send token to client
        // @ts-expect-error
        createSendToken(user, 200, isAuthenticated, res);
    }
    catch (err) {
        return res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.login = login;
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        // 1) Getting token and check of it's there
        let token;
        if ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                status: "fail",
                message: "You are not logged in! Please log in to get access.",
            });
        }
        // 2) Verification token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET); // Type Assertion
        const currentUser = yield userModel_1.default.findById(decoded.id);
        // @ts-expect-error
        req.user = currentUser;
        next();
    }
    catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
});
exports.protect = protect;
const restrictTo = (...roles) => {
    return (req, res, next) => {
        // roles ['admin', 'user']. role='user'
        // @ts-expect-error
        if (!roles.includes(req.user.role)) {
            console.log("Current user in restrictTo Function", 
            // @ts-expect-error
            req.user);
            return res.status(401).json({
                status: "fail",
                message: "You do not have permission to perform this action",
            });
        }
        next();
    };
};
exports.restrictTo = restrictTo;
