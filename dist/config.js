"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 443; //8080//
const STRCNX = process.env.STRCNX || 'mongodb://127.0.0.1';
const BASE = process.env.BASE || 'test';
exports.default = {
    PORT,
    STRCNX,
    BASE,
};
