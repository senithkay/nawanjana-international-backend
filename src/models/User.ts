import * as mongoose from "mongoose";
import bcrypt from 'bcrypt'

const Schema = mongoose.Schema;

interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    image:string;
    wishList:Array<mongoose.Types.ObjectId>;
    mobile:string;
}

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "The email address has to be unique"],
        index: [true]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "The username address has to be unique"],
        index: [true]
    },
    image:{
        type: String,
    },
    wishList: [{ type: Schema.Types.ObjectId, ref: 'WishListItem' }],
    mobile: {
        type: String,
        required: [true, "Mobile number is required"],
    },
})
userSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next()
})



const User = mongoose.model<IUser>('User', userSchema);
export default User;
