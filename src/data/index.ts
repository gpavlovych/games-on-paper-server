import * as mongoose from "mongoose";
import {Connection, Schema} from "mongoose";

export const openMongoose = () =>
    mongoose.createConnection(
        `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DATABASE}`,
        {useMongoClient: true});

const userSchema = new Schema({
    displayName: {type: String, required: true},
    email: {type: String, required: true},
    roleName: {type: String, required: true},
    passwordHash: {type: String}
});

export const User = (client: Connection) => client.Model("User", userSchema);