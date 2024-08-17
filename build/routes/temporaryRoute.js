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
const express_1 = __importDefault(require("express"));
const logger_1 = require("../utils/logger");
const http_1 = require("../utils/http");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
router.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let error = undefined;
    let data = {};
    try {
        const cookies = (_a = req.cookies) !== null && _a !== void 0 ? _a : {};
        const token = cookies.jwt;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                const userId = decoded.id;
                data = yield User_1.default.findById(userId);
                (0, http_1.sendResponse)(data, res, undefined);
            }));
        }
        else {
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        (0, http_1.sendResponse)(data, res, error, 500);
    }
}));
exports.default = router;
