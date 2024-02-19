"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBconnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const DBconnect = () => {
    const { DATABASE, DATABASE_PASSWORD } = process.env;
    if (DATABASE === undefined || DATABASE_PASSWORD === undefined) {
        throw new Error('DATABASE environment variable(s) not set');
    }
    const dbConnectionString = DATABASE.replace('<PASSWORD>', DATABASE_PASSWORD);
    void mongoose_1.default.connect(dbConnectionString);
    mongoose_1.default.connection
        .on('open', () => {
        console.log('connected to mongo');
    })
        .on('close', () => {
        console.log('disconnected from mongo');
    })
        .on('error', (error) => {
        console.log('connection failed', error);
    });
};
exports.DBconnect = DBconnect;
