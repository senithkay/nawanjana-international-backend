import * as mongoose from "mongoose";


const connectDB = async () => {
    mongoose.set('strictQuery', false)
    const mongoDb = process.env.DATABASE_CONNECTION
    try {
        return await mongoose.connect(mongoDb);
    }
    catch(err) {
        throw err;
    }
}

export default connectDB;