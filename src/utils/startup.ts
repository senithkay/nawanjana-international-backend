import dotenv from "dotenv";
import connectDB from "../database/connection";

export const startup = ()=> {
    console.log("Starting up the server...");
    console.log("[INFO] Loading environment type")
    const envType = process.argv[2]
    if (envType === undefined) {
        console.log("[ERROR] Loading environment type failed")
        console.log("[INFO] Using configured env variables")
    }
    console.log("[INFO] Environment type loaded successfully")
    if (envType === 'dev'){
        console.log("[INFO] Loading environment for development")
        dotenv.config({path: `.env.dev`})
    }
    else if (envType === 'prod'){
        console.log("[INFO] Loading environment for production")
        dotenv.config({path: `.env.prod`})
    }
    else {
        console.log(`[ERROR] Unable to load the environment for type ${envType}`)
    }
    console.log("[INFO] Environment loaded successfully")
    console.log("[INFO] Reading database connection URL")
    console.log("[INFO] Attempting to connect to the database")
    connectDB().then(()=>console.log("[INFO] Database connected successfully")).catch((err)=>console.log(err));
}