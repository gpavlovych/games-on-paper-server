import * as mongoose from "mongoose";
import { userSchema, User, userModelName } from "./user";
import { gameDefinitionSchema, gameDefinitionModelName, GameDefinition } from "./game-definition";

export const gameModelName="Game";

export const gameSchema = new mongoose.Schema({
    gameDefinition: { type: mongoose.Schema.Types.ObjectId, ref: gameDefinitionModelName, required: true },
    winner: {type: mongoose.Schema.Types.ObjectId, ref: userModelName, required: false},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: userModelName}],
    stats: {type: mongoose.Schema.Types.Mixed, required: false},
    data: {type: mongoose.Schema.Types.Mixed, required: false}
});

export interface Game extends mongoose.Document {
    gameDefinition: GameDefinition;
    winner?: User;
    users?: User[];
    stats?: any;
    data?: any;
}