"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFakeToken = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_MAX_AGE,
    });
};
exports.createToken = createToken;
const createFakeToken = () => {
    return jsonwebtoken_1.default.sign({}, process.env.JWT_SECRET, {
        expiresIn: 1,
    });
};
exports.createFakeToken = createFakeToken;
