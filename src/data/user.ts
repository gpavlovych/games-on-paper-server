import * as mongoose from "mongoose";

export const userModelName = "User";

export const userSchema = new mongoose.Schema({
    displayName: {type: String, required: true},
    email: {type: String, required: true},
    roleName: {type: String, required: true},
    passwordHash: {type: String}
});

export interface User extends mongoose.Document {
    displayName: string;
    email: string;
    roleName: string;
    passwordHash: string;
}