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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_1 = require("../utils/http");
const User_1 = __importDefault(require("../models/User"));
const WishListItem_1 = __importDefault(require("../models/WishListItem"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const cookies = (_a = req.cookies) !== null && _a !== void 0 ? _a : {};
        const token = cookies.jwt;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                const id = decoded.id;
                const wishListItems = yield User_1.default.findById(id).select("wishList");
                res.send();
                // sendResponse(updatedUser, res, undefined,200)
            }));
        }
        else {
            (0, http_1.sendResponse)({}, res, "You need to be logged in to add this item into your cart", 401);
        }
    }
    catch (err) {
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const cookies = (_b = req.cookies) !== null && _b !== void 0 ? _b : {};
        const token = cookies.jwt;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                const id = decoded.id;
                const gemId = req.body.gemId;
                const wishListItem = yield WishListItem_1.default.create({
                    gemId: gemId,
                    isDefaultPrice: true
                });
                const populatedWishListItem = yield WishListItem_1.default.findById(wishListItem._id).populate('gemId');
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: id }, { $push: { wishList: wishListItem._id } }, { new: true });
                if (updatedUser) {
                    yield session.commitTransaction();
                    yield session.endSession();
                    (0, http_1.sendResponse)(populatedWishListItem, res, undefined, 200);
                    return;
                }
                else {
                    yield session.abortTransaction();
                    yield session.endSession();
                    (0, http_1.sendResponse)({}, res, "Unable to Add Item Into The Wish List", 200);
                    return;
                }
            }));
        }
        else {
            yield session.endSession();
            (0, http_1.sendResponse)({}, res, "You need to be logged in to add this item into your cart", 401);
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        yield session.abortTransaction();
        yield session.endSession();
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const cookies = (_c = req.cookies) !== null && _c !== void 0 ? _c : {};
        const token = cookies.jwt;
        if (token) {
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                const id = decoded.id;
                const updatedUser = yield User_1.default.findOneAndUpdate({ _id: id }, { $pull: { wishList: req.params.id } }, { new: true });
                const wishListItem = yield WishListItem_1.default.findByIdAndDelete(req.params.id, { returnOriginal: true });
                if (updatedUser) {
                    yield session.commitTransaction();
                    yield session.endSession();
                    (0, http_1.sendResponse)(wishListItem, res, undefined, 200);
                    return;
                }
                else {
                    yield session.abortTransaction();
                    yield session.endSession();
                    (0, http_1.sendResponse)({}, res, "Unable to Add Item Into The Wish List", 200);
                    return;
                }
            }));
        }
        else {
            yield session.endSession();
            (0, http_1.sendResponse)({}, res, "You need to be logged in to add this item into your cart", 401);
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        yield session.abortTransaction();
        yield session.endSession();
    }
}));
exports.default = router;
