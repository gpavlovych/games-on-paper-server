import * as mongoose from "mongoose";

export const gameDefinitionModelName = "GameDefinition";

export enum GameDefinitionHandler {
    Dots="Dots",
    TicTacToe= "TicTacToe"
}

export const gameDefinitionSchema = new mongoose.Schema({
    pictureUrl: {type: String, required: false},
    displayName: {type: String, required: true},
    description: {type: String, required: true},
    module: {type: GameDefinitionHandler, required: true}
});

export interface GameDefinition extends mongoose.Document {
    pictureUrl?: string;
    displayName: string;
    description: string;
    module: GameDefinitionHandler;
}