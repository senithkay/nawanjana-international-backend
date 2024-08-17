"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const branchSchema = new Schema({
    name: {
        type: String,
        unique: [true, 'A branch with this name is already exists'],
        required: [true, 'Branch name is required'],
    },
    branchLocation: {
        type: String,
    },
    stocks: [{ type: Schema.Types.ObjectId, ref: 'stock' }]
});
const Branch = mongoose_1.default.model('branch', branchSchema);
exports.default = Branch;
