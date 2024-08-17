"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const productSchema = new Schema({
    productName: {
        type: String,
        required: [true, "Product name is required"],
        unique: [true, "Another product with the same name is already exists"],
    },
    sku: {
        type: String,
        unique: [true, "Another product with the same SKU is already exists"],
    },
    price: {
        type: String,
        required: [true, "Price of the product is required"],
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    },
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
