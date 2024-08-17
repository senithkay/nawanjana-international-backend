import jwt from 'jsonwebtoken'
import mongoose, {Schema, Types} from "mongoose";

export const createToken = (id: Types.ObjectId) => {
    return jwt.sign({id:id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_MAX_AGE,
    })
}

export const createFakeToken = () => {
    return jwt.sign({}, process.env.JWT_SECRET, {
        expiresIn: 1,
    })
}