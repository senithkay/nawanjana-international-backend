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
const http_1 = require("../utils/http");
const Branch_1 = __importDefault(require("../models/Branch"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
router.get("/monthly-stock/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let error = undefined;
    let data = [];
    let responseStatus = 200;
    try {
        const branch = yield Branch_1.default.findById(req.params.id).populate('stocks');
        if (branch) {
            let stocks = branch.stocks;
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth();
            const numberOfDays = new Date(currentDate.getFullYear(), currentMonth + 1, 0).getDate();
            const dailyStock = [];
            const days = [];
            if (stocks === undefined) {
                stocks = [];
            }
            for (let day = 1; day <= numberOfDays; day++) {
                const dateString = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                const stocksOfTheDay = stocks.filter((stock) => stock.date === dateString);
                const soldQty = stocksOfTheDay.reduce((accumulator, currentValue) => {
                    return accumulator + (currentValue.availableStock - currentValue.remainingStock);
                }, 0);
                dailyStock.push(soldQty);
                days.push(dateString);
            }
            data = {
                days: days,
                values: dailyStock,
            };
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.get('/daily-sales/:id/:date', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    let error = undefined;
    let date = req.params.date;
    let responseStatus = 200;
    try {
        const branch = yield Branch_1.default.findById(req.params.id).populate('stocks');
        if (branch) {
            const stocks = branch.stocks;
            const stocksOfTheDay = stocks.filter((stock) => stock.date === date);
            const soldQty = stocksOfTheDay.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.availableStock - currentValue.remainingStock);
            }, 0);
            const totalQty = stocksOfTheDay.reduce((accumulator, currentValue) => {
                return accumulator + (currentValue.availableStock);
            }, 0);
            data = {
                sold: soldQty,
                total: totalQty,
            };
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
