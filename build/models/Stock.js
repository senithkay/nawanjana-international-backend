"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const stockSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, 'Product is required for a stock'],
    },
    date: {
        type: String,
    },
    availableStock: {
        type: Number,
        required: [true, 'A stock should have an available stock'],
    },
    remainingStock: {
        type: Number,
        required: [true, 'A stock should have a remaining stock'],
    },
    pricePerUnit: {
        type: Number,
        required: [true, 'A stock should have a price per unit value'],
    }
});
const Stock = mongoose_1.default.model('stock', stockSchema);
exports.default = Stock;
