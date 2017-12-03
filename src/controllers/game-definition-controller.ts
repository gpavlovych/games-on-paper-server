import {jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import * as Router from "koa-router";
import {Context} from "koa";
import {createdStatus} from "../middleware/status";
import {
    CreateGameDefinitionRequest,
    CreateGameDefinitionResponse, DeleteGameDefinitionResponse, GameDefinitionDetails, GameDefinitionInfo,
    UpdateGameDefinitionRequest,
    UpdateGameDefinitionResponse
} from "../models/game-definition-controller-models";

export class GameDefinitionController {

    constructor() {}

    public registerRoutes(router: Router) {
        router
            .get("/api/game-definitions", jwtVerify, async (ctx: Context) => {
                ctx.body = await this.get();
            })
            .get("/api/game-definitions/:id", jwtVerify, async (ctx: Context) => {
                ctx.body = await this.getById(ctx.params.id);
            })
            .post("/api/game-definitions", jwtVerifyRole("admin"),async (ctx: Context) => {
                ctx.body = await this.post(ctx.request.body);
            }, createdStatus)
            .put("/api/game-definitions/:id", jwtVerifyRole("admin"), async (ctx: Context) => {
                ctx.body = await this.put(ctx.params.id, ctx.request.body);
            })
            .del("/api/game-definitions/:id", jwtVerifyRole("admin"), async (ctx: Context) => {
                ctx.body = await this.del(ctx.params.id);
            });
    }

    private async get() : Promise<GameDefinitionInfo[]> {
        return [];
    }

    private async getById(id: string): Promise<GameDefinitionDetails> {
        return {};
    }

    private async post(model: CreateGameDefinitionRequest): Promise<CreateGameDefinitionResponse> {
        return {};
    }

    private async put(id: string, model: UpdateGameDefinitionRequest): Promise<UpdateGameDefinitionResponse> {
        return {};
    }

    private async del(id: string): Promise<DeleteGameDefinitionResponse> {
        return {};
    }
}