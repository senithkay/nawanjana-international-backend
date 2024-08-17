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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = require("../utils/http");
const PriceRequest_1 = __importDefault(require("../models/PriceRequest"));
const router = express_1.default.Router();
router.post('/', (req, res) => {
    var _a;
    try {
        const cookies = (_a = req.cookies) !== null && _a !== void 0 ? _a : {};
        const token = cookies.jwt;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                req.body.userId = decoded.id;
                const priceRequest = new PriceRequest_1.default(req.body);
                try {
                    const savedPriceRequest = yield priceRequest.save();
                    if (savedPriceRequest === undefined || savedPriceRequest === null) {
                        (0, http_1.sendResponse)({}, res, "Unable to process your request", 500);
                        return;
                    }
                    (0, http_1.sendResponse)(savedPriceRequest, res, undefined, 200);
                }
                catch (err) {
                    (0, logger_1.logger)(err);
                    (0, http_1.sendResponse)({}, res, "You cannot send two requests for the same item", 500);
                    return;
                }
            }));
        }
        else {
            (0, http_1.sendResponse)({}, res, "You need to be logged in to add this item into your cart", 401);
            return;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        (0, http_1.sendResponse)({}, res, "Unable to process your request", 500);
        return;
    }
});
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const priceRequests = yield PriceRequest_1.default.find().populate({
            path: 'userId',
            select: ['mobile', 'email', 'username']
        }).populate('gemId');
        if (priceRequests === undefined || priceRequests === null) {
            (0, http_1.sendResponse)({}, res, "Unable to fetch price requests", 500);
            return;
        }
        (0, http_1.sendResponse)(priceRequests, res, undefined, 200);
    }
    catch (err) {
        (0, logger_1.logger)(err);
    }
}));
exports.default = router;
