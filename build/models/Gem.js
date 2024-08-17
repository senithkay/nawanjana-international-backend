"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const Schema = mongoose.Schema;
const gemSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, "The name has to be unique"],
        index: [true]
    },
    description: {
        type: String,
        required: [true, "A description about the gem is required"],
    },
    color: {
        type: String,
        required: [true, "Color of the gem is required"],
        index: [true]
    },
    price: {
        type: Number,
    },
    treatments: [{ type: String, required: [true, "Treatments is required"], index: [true] }],
    shape: {
        type: String,
        required: [true, "Shape is required"],
        index: [true]
    },
    gemType: {
        type: String,
        required: [true, "Gem type is required"],
        index: [true]
    },
    images: [{
            type: String,
        }],
    about: {
        type: String,
        required: [true, "About is required"],
    }
});
const Gem = mongoose.model('Gem', gemSchema);
exports.default = Gem;
