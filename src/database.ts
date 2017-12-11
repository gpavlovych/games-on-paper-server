'use strict';
import * as mongoose from "mongoose";
import * as bluebird from "bluebird";
import { User, userSchema, userModelName } from "./data/user";
import * as bcrypt from "bcrypt";
import { mongo } from "mongoose";
import { GameDefinition, GameDefinitionHandler, gameDefinitionSchema, gameDefinitionModelName } from "./data/game-definition";
import { gameModelName, gameSchema, Game } from "./data/game";

const seedUsers = async(model: mongoose.Model<User>) => {
    const usersCount = await model.find().count();
    const passwordHash = await bcrypt.hash("1234", 10);
    if (usersCount === 0) {
        const adminUserModel = new model({
            displayName: "admin",
            email: "admin@example.com",
            roleName: "admin",
            passwordHash:passwordHash});
        await adminUserModel.save(); 
        const playerUserModel1 = new model({
            displayName: "player 1",
            email: "player1@example.com",
            roleName: "player",
            passwordHash:passwordHash});
        await playerUserModel1.save(); 
        const playerUserModel2 = new model({
            displayName: "player 2",
            email: "player2@example.com",
            roleName: "player",
            passwordHash:passwordHash});
        await playerUserModel2.save();
        const playerUserModel3 = new model({
            displayName: "player 3",
            email: "player3@example.com",
            roleName: "player",
            passwordHash:passwordHash});
        await playerUserModel3.save();  
        console.log("users are seed");
    }
};

const seedGameDefinitions = async(model: mongoose.Model<GameDefinition>) => {
    const gameDefinitionsCount = await model.find().count();
    if (gameDefinitionsCount === 0) {
        const dotsGameDefinitionModel = new model({
            displayName: "Dots game",
            description: `Although the phrase is nonsense, it does have a long history.`+
                        ` The phrase has been used for several centuries by typographers to `+
                        `show the most distinctive features of their fonts. It is used because `+
                        `the letters involved and the letter spacing in those combinations reveal, `+
                        `at their best, the weight, design, and other important features of the typeface.`,
            module: GameDefinitionHandler.Dots});
        await dotsGameDefinitionModel.save(); 
        const ticTacToeGameDefinitionModel = new model({
            displayName: "Tic Tac Toe game",
            description: `A 1994 issue of "Before & After" magazine traces `+
            `"Lorem ipsum ..." to a jumbled Latin version of a passage from de Finibus `+
            `Bonorum et Malorum, a treatise on the theory of ethics written by Cicero in`+
            ` 45 B.C. The passage "Lorem ipsum ..." is taken from text that reads, `+
            `"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur,`+
            ` adipisci velit ...," which translates as, "There is no one who loves pain `+
            `itself, who seeks after it and wants to have it, simply because it is pain...`+
            `"            `,
            module: GameDefinitionHandler.TicTacToe});
        await ticTacToeGameDefinitionModel.save(); 
        console.log("game definitions are seed");
    }
};

const seedGames = async(model: mongoose.Model<Game>, userModel: mongoose.Model<User>, gameDefinitionModel: mongoose.Model<GameDefinition>) => {
    const gamesCount = await model.find().count();
    if (gamesCount === 0) {
        const ticTacToe = await gameDefinitionModel.findOne({module: GameDefinitionHandler.TicTacToe}, "_id");
        const dots = await gameDefinitionModel.findOne({module: GameDefinitionHandler.Dots}, "_id");
        const players = await userModel.find({roleName: "player"}, "_id");
        const dotsGameModel1 = new model({gameDefinition: dots._id, stats: {"some": "any"}, data: {"whatever":"goes"}, users:[players[0]._id, players[1]._id]});
        await dotsGameModel1.save();
        const dotsGameModel2 = new model({gameDefinition: dots._id, winner: players[0]._id, stats: {"some": "any"}, data: {"whatever":"goes"}, users:[players[0]._id, players[1]._id]});
        await dotsGameModel2.save();
        const dotsGameModel3 = new model({gameDefinition: dots._id, winner: players[1]._id, stats: {"some": "any"}, data: {"whatever":"goes"}, users:[players[0]._id, players[1]._id]});
        await dotsGameModel3.save();
        const ticTacToeGameModel1 = new model({gameDefinition: ticTacToe._id, stats: {"some": "any"}, data: {"whatever":"goes"}, players:[players[0]._id, players[1]._id]});
        await ticTacToeGameModel1.save();
        const ticTacToeGameModel2 = new model({gameDefinition: ticTacToe._id, winner: players[0]._id, stats: {"some": "any"}, data: {"whatever":"goes"}, users:[players[0]._id, players[1]._id]});
        await ticTacToeGameModel2.save();
        const ticTacToeGameModel3 = new model({gameDefinition: ticTacToe._id, winner: players[1]._id, stats: {"some": "any"}, data: {"whatever":"goes"}, users:[players[0]._id, players[1]._id]});
        await ticTacToeGameModel3.save();
        console.log("games are seed");
    }
};

export interface Database {
    userModel: mongoose.Model<User>;
    gameDefinitionModel: mongoose.Model<GameDefinition>;
    gameModel: mongoose.Model<Game>;
}

export function init(config: {
    url: string,
    user?: string,
    pwd?: string
}): Promise<Database> {
    (<any>mongoose).Promise = bluebird.Promise;
    return new Promise<Database>((resolve: (db?: Database) => void, reject: (reason?: any) => void) => {
        const mongoDb = mongoose.createConnection(config.url, {user: config.user, pass: config.pwd});
        
        const userModel: mongoose.Model<User> = mongoDb.model(userModelName, userSchema);
        const gameDefinitionModel: mongoose.Model<GameDefinition> = mongoDb.model(gameDefinitionModelName, gameDefinitionSchema);
        const gameModel: mongoose.Model<Game> = mongoDb.model(gameModelName, gameSchema);
        const database: Database = {
            userModel: userModel,
            gameDefinitionModel: gameDefinitionModel,
            gameModel: gameModel
        };

        mongoDb.on('error', () => {
            console.log(`Unable to connect to database: ${config.url}`);
            reject();
        });

        mongoDb.once('open', async () => {
            console.log(`Connected to database: ${config.url}`);
            await seedUsers(userModel);
            await seedGameDefinitions(gameDefinitionModel);
            await seedGames(gameModel, userModel,gameDefinitionModel);
            resolve(database);
        });
    });
}