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
exports.compileReport = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const handlebars_1 = __importDefault(require("handlebars"));
const logger_1 = require("./logger");
const TEMPLATE_DIR = path_1.default.resolve(__dirname, '../../reportTemplates/');
const compileReport = (templateName, data) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(TEMPLATE_DIR, templateName);
    const html = yield fs_extra_1.default.readFile(filePath, 'utf-8');
    const logoBase64 = base64Encode('./src/public/lh.jpg');
    return handlebars_1.default.compile(html.replace('${logoBase64}', logoBase64))(data);
});
exports.compileReport = compileReport;
function base64Encode(file) {
    try {
        const bitmap = fs_extra_1.default.readFileSync(file);
        return Buffer.from(bitmap).toString('base64');
    }
    catch (error) {
        (0, logger_1.logger)(`[error] file : ${file} not found`);
        return '';
    }
}
