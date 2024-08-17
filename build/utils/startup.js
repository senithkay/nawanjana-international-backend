"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startup = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const connection_1 = __importDefault(require("../database/connection"));
const startup = () => {
    console.log("Starting up the server...");
    console.log("[INFO] Loading environment type");
    const envType = process.argv[2];
    if (envType === undefined) {
        console.log("[ERROR] Loading environment type failed");
        console.log("[INFO] Using configured env variables");
    }
    console.log("[INFO] Environment type loaded successfully");
    if (envType === 'dev') {
        console.log("[INFO] Loading environment for development");
        dotenv_1.default.config({ path: `.env.dev` });
    }
    else if (envType === 'prod') {
        console.log("[INFO] Loading environment for production");
        dotenv_1.default.config({ path: `.env.prod` });
    }
    else {
        console.log(`[ERROR] Unable to load the environment for type ${envType}`);
    }
    console.log("[INFO] Environment loaded successfully");
    console.log("[INFO] Reading database connection URL");
    console.log("[INFO] Attempting to connect to the database");
    (0, connection_1.default)().then(() => console.log("[INFO] Database connected successfully")).catch((err) => console.log(err));
};
exports.startup = startup;
