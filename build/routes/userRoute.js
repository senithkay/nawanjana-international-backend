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
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let data = [];
    try {
        const cookies = (_a = req.cookies) !== null && _a !== void 0 ? _a : {};
        const token = cookies.jwt;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (decoded.isSuperAdmin) {
                    const users = yield User_1.default.find({ _id: { $ne: decoded.id } }).select('-password').populate('uLocation');
                    if (users) {
                        data = users;
                    }
                    (0, http_1.sendResponse)(data, res, undefined);
                }
                else {
                    data = [];
                    (0, http_1.sendResponse)(data, res, undefined);
                }
            }));
        }
        else {
            (0, http_1.sendResponse)(data, res, 'User not found', 400);
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
    }
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new User_1.default({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        uLocation: req.body.location,
        isSuperAdmin: false
    });
    let responseStatus = 200;
    let error = undefined;
    let data = {};
    try {
        const savedUser = yield user.save();
        if (savedUser) {
            data = savedUser;
        }
    }
    catch (err) {
        console.log(err);
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const changes = {
        email: req.body.email,
        username: req.body.username,
        uLocation: req.body.location,
    };
    let error = undefined;
    let data = {};
    let responseStatus = 200;
    try {
        const updatedUser = yield User_1.default.findByIdAndUpdate(id, changes, { new: true });
        if (updatedUser) {
            data = updatedUser;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.id);
    let error = undefined;
    let data = {};
    let responseStatus = 200;
    try {
        const deletedUser = yield User_1.default.findByIdAndDelete(id, { returnDocument: 'after' });
        if (deletedUser) {
            data = deletedUser;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
exports.default = router;
