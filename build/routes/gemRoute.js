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
const Gem_1 = __importDefault(require("../models/Gem"));
const http_1 = require("../utils/http");
const multer_1 = __importDefault(require("multer"));
const logger_1 = require("../utils/logger");
const router = express_1.default.Router();
const SIZE_PER_PAGE = 16;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const gems = yield Gem_1.default.find().select(['_id', 'name', 'price', 'gemType', 'color', 'treatments', 'shape', 'image']);
        if (gems === undefined) {
            (0, http_1.sendResponse)([], res, 'Failed to load store, Try again later', 500);
            return;
        }
        (0, http_1.sendResponse)({
            numberOfPages: Math.ceil(gems.length / 16),
            gems: gems.slice(0, SIZE_PER_PAGE)
        }, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)([], res, 'Failed to load store, Try again later', 500);
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const databaseFilter = {};
        const filters = req.body;
        if (filters.shape.length > 0) {
            databaseFilter.shape = { $in: filters.shape };
        }
        if (filters.color.length > 0) {
            databaseFilter.color = { $in: filters.color };
        }
        if (filters.gemType.length > 0) {
            databaseFilter.gemType = { $in: filters.gemType };
        }
        if (filters.treatments.length > 0) {
            databaseFilter.treatments = { $in: filters.treatments };
        }
        const gems = yield Gem_1.default.find(databaseFilter).select(['_id', 'name', 'price', 'gemType', 'color', 'treatments', 'shape', 'image']).skip((((_a = filters.page) !== null && _a !== void 0 ? _a : 1) - 1) * SIZE_PER_PAGE).limit(SIZE_PER_PAGE);
        if (gems === undefined) {
            (0, http_1.sendResponse)([], res, 'Failed to load store, Try again later', 500);
            return;
        }
        (0, http_1.sendResponse)(gems, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)([], res, 'Failed to load store, Try again later', 500);
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const gem = yield Gem_1.default.findById(id);
        if (gem === undefined || gem === null) {
            (0, http_1.sendResponse)({}, res, 'Failed to load store, Try again later', 404);
            return;
        }
        const data = {
            _id: gem._id,
            description: gem.description,
            about: gem.about
        };
        (0, http_1.sendResponse)(gem, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)({}, res, 'Failed to load store, Try again later', 500);
    }
}));
router.get('/:shape/:color/:treatments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const shape = req.params.shape;
        const color = req.params.color;
        const treatment = req.params.treatment;
        const gems = yield Gem_1.default.find({ $or: [
                { shape: shape },
                { color: color },
                { treatments: { $in: treatment } }
            ] });
        if (gems === undefined || gems === null) {
            (0, http_1.sendResponse)([], res, 'Failed to load store, Try again later', 404);
            return;
        }
        (0, http_1.sendResponse)(gems, res, undefined, 200);
    }
    catch (err) {
        (0, http_1.sendResponse)({}, res, 'Failed to load store, Try again later', 500);
    }
}));
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
router.post('/', uploadProductImage.array('images', 8), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.files || !Array.isArray(req.files)) {
            (0, http_1.sendResponse)({}, res, 'No files were uploaded.', 500);
            return;
        }
        const files = req.files;
        req.body.images = files.map(file => file.filename);
        req.body.treatments = JSON.parse(req.body.treatments).map((treatment) => treatment.value);
        const gem = new Gem_1.default(req.body);
        const savedGem = gem.save();
        if (savedGem === undefined || savedGem === null) {
            (0, http_1.sendResponse)({}, res, 'Failed to save gem, Try again later', 500);
            return;
        }
        (0, http_1.sendResponse)(savedGem, res, undefined, 200);
        return;
    }
    catch (err) {
        (0, logger_1.logger)(err);
        (0, http_1.sendResponse)({}, res, 'Failed to upload gem, Try again later', 500);
        return;
    }
}));
exports.default = router;
