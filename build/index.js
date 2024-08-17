"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const startup_1 = require("./utils/startup");
(0, startup_1.startup)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: '25mb' }));
// app.use(authorize);
app.use(express_1.default.static('src/public/'));
app.get('/backend-status', (req, res) => {
    res.send('STATUS:RUNNING');
});
app.use('/auth', authRoute_1.default);
app.listen(process.env.PORT || 8080, () => {
    console.log(`[INFO] Server started on http://localhost:${process.env.PORT}`);
});
