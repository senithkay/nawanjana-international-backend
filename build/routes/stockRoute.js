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
const Branch_1 = __importDefault(require("../models/Branch"));
const Stock_1 = __importDefault(require("../models/Stock"));
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const http_1 = require("../utils/http");
const router = express_1.default.Router();
//Todo Remove this
// router.get("/:id", async (req: express.Request, res: express.Response) => {
//    let error = undefined;
//    let data:any[] = [];
//     let responseStatus = 200
//    try{
//        const branch = await Branch.findById(req.params.id).populate({ path: 'stocks', populate: { path: 'productId', select: 'productName' } });
//        if (branch && branch.stocks) {
//            data = branch.stocks
//        }
//    }
//    catch (err){
//        logger(err);
//        error = err;
//        responseStatus = 500
//    }
//     sendResponse(data, res, error,  responseStatus)
//
// })
router.get('/:id/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    let error = undefined;
    let date = req.params.date;
    if (req.params.date === undefined || req.params.date === null) { }
    let responseStatus = 200;
    try {
        const branch = yield Branch_1.default.findById(req.params.id).populate({ path: 'stocks', populate: { path: 'productId', select: 'productName' } });
        if (branch) {
            const stocks = branch.stocks;
            const filteredData = [];
            stocks.forEach((stock) => {
                if (stock.date === date) {
                    filteredData.push(stock);
                }
            });
            data = filteredData;
        }
        else {
            error = 'Invalid branch ID';
            responseStatus = 400;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.get("/:id/:date", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = undefined;
    let data = [];
    let responseStatus = 200;
    try {
        const branch = yield Branch_1.default.findById(req.params.id).populate('stocks');
        if (branch && req.params.date && req.params.date !== '') {
            data = branch.stocks.filter((stock) => {
                stock.populate('productId');
                return stock.date === req.params.date;
            });
        }
        else {
            error = 'Invalid dates';
            responseStatus = 400;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.get("/:id/:fromDate/:toDate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = undefined;
    let data = [];
    let responseStatus = 200;
    try {
        const branch = yield Branch_1.default.findById(req.params.id).populate('stocks');
        if (branch && req.params.date && req.params.date !== '') {
            data = branch.stocks.filter((stock) => {
                stock.populate('productId');
                return ((stock.date >= req.params.fromDate && stock.date <= req.params.toDate) || stock.date === req.params.fromDate);
            });
        }
        else {
            responseStatus = 400;
            error = 'Invalid Dates';
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = undefined;
    let data = {};
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    let responseStatus = 200;
    let stocks = [];
    try {
        const branch = yield Branch_1.default.findById(req.body.branchId).populate('stocks');
        if (!branch) {
            (0, http_1.sendResponse)(data, res, 'Branch Not Found', 400);
            return;
        }
        if (branch.stocks === undefined) {
            stocks = [];
        }
        stocks = branch.stocks;
        const existingStock = stocks.find((stock) => (stock.productId == req.body.stock.productId && stock.date == req.body.stock.date));
        const newStock = new Stock_1.default(req.body.stock);
        let insertedStock = {};
        if (existingStock) {
            const changes = {
                date: newStock.date,
                availableStock: newStock.availableStock,
                remainingStock: newStock.remainingStock,
                pricePerUnit: newStock.pricePerUnit
            };
            const updatedData = yield Stock_1.default.findByIdAndUpdate(existingStock._id, changes, { new: true });
            if (updatedData) {
                insertedStock = updatedData;
            }
        }
        else {
            insertedStock = yield newStock.save();
            responseStatus = 201;
        }
        if (!insertedStock) {
            (0, http_1.sendResponse)(data, res, 'Failed creating stock', 500);
            return;
        }
        branch.stocks.push(newStock._id);
        yield branch.save();
        yield session.commitTransaction();
        yield session.endSession();
        const insertedSchemaObject = new Stock_1.default(insertedStock);
        data = yield insertedSchemaObject.populate({ path: 'productId', select: 'productName' });
    }
    catch (err) {
        (0, logger_1.logger)(err);
        yield session.abortTransaction();
        yield session.endSession();
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = undefined;
    let data = {};
    let responseStatus = 200;
    try {
        const receivedData = req.body;
        const updatedStock = yield Stock_1.default.findByIdAndUpdate(req.params.id, receivedData, { new: true });
        if (updatedStock) {
            data = updatedStock;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = undefined;
    let data = {};
    try {
        const deletedStock = yield Stock_1.default.findByIdAndDelete(req.params.id, { returnDocument: 'after' });
        if (deletedStock) {
            data = deletedStock;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
    }
    (0, http_1.sendResponse)(data, res, error);
}));
exports.default = router;
