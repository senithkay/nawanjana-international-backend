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
const Product_1 = __importDefault(require("../models/Product"));
const logger_1 = require("../utils/logger");
const http_1 = require("../utils/http");
const multer_1 = __importDefault(require("multer"));
const Stock_1 = __importDefault(require("../models/Stock"));
const router = express_1.default.Router();
const getFileName = (originalName) => {
    return Date.now() + '_' + originalName;
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './src/public/images');
    },
    filename(req, file, callback) {
        callback(null, getFileName(file.originalname));
    }
});
const uploadProductImage = (0, multer_1.default)({ storage });
router.post('/', uploadProductImage.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    req.body.image = getFileName((_b = (_a = req.file) === null || _a === void 0 ? void 0 : _a.originalname) !== null && _b !== void 0 ? _b : 'default');
    const product = new Product_1.default(req.body);
    let error = undefined;
    let data = {};
    let responseStatus = 200;
    try {
        const savedProduct = yield product.save();
        if (savedProduct) {
            data = savedProduct;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = [];
    let error = undefined;
    let responseStatus = 200;
    try {
        const products = yield Product_1.default.find();
        if (products) {
            data = products;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const changes = {
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        sku: req.body.sku,
    };
    let error = undefined;
    let data = {};
    let responseStatus = 200;
    try {
        const updatedProduct = yield Product_1.default.findByIdAndUpdate(id, changes, { new: true });
        if (updatedProduct) {
            data = updatedProduct;
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
    const id = req.params.id;
    let error = undefined;
    let data = {};
    let responseStatus = 200;
    try {
        const deletedProduct = yield Product_1.default.findByIdAndDelete(id, { returnDocument: 'after' });
        const stocks = yield Stock_1.default.deleteMany({ productId: id });
        if (deletedProduct) {
            data = deletedProduct;
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        error = err;
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
router.get('/price/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = {};
    let error = undefined;
    let responseStatus = 200;
    try {
        const product = yield Product_1.default.findById(req.params.id);
        if (product) {
            data = { productId: product._id, price: product.price };
        }
    }
    catch (err) {
        (0, logger_1.logger)(err);
        if (err.errorResponse.code == 11000) {
            error = { _message: "Product needs to be unique" };
        }
        else {
            error = err;
        }
        responseStatus = 500;
    }
    (0, http_1.sendResponse)(data, res, error, responseStatus);
}));
exports.default = router;
