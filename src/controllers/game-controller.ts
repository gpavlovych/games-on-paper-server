import {jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import * as Router from "koa-router";
import {Context} from "koa";
import {
    AcceptGameRequest,
    AcceptGameResponse,
    CreateGameRequest, CreateGameResponse, DeclineGameRequest, DeclineGameResponse, DeleteGameResponse,
    GameDetailsResponse,
    GameInfo, InviteGameRequest, InviteGameResponse, UpdateGameRequest, UpdateGameResponse
} from "../models/game-controller-models";
import {createdStatus} from "../middleware/status";

export class GameController {

    constructor() {}

    public registerRoutes(router: Router) {
        router
            .get("/api/games", jwtVerify, async (ctx: Context) => {
                ctx.body = await this.get();
            })
            .get("/api/games/:id", jwtVerify, async (ctx: Context) => {
                ctx.body = await this.getById(ctx.params.id);
            })
            .post("/api/games/invite", jwtVerify, async (ctx: Context) => {
                ctx.body =  await this.postInvite(ctx.request.body);
            }, createdStatus)
            .post("/api/games/:id/accept", jwtVerify, async (ctx: Context) => {
                ctx.body =  await this.postAccept(ctx.params.id, ctx.request.body);
            })
            .post("/api/games/:id/decline", jwtVerify, async (ctx: Context) => {
                ctx.body = await this.postDecline(ctx.params.id, ctx.request.body);
            })
            .post("/api/games", jwtVerifyRole("admin"),async (ctx: Context) => {
                ctx.body = await this.post(ctx.request.body);
            }, createdStatus)
            .put("/api/games/:id", jwtVerifyRole("admin"), async (ctx: Context) => {
                ctx.body = await this.put(ctx.params.id, ctx.request.body);
            })
            .del("/api/games/:id", jwtVerifyRole("admin"), async (ctx: Context) => {
                ctx.body = await this.del(ctx.params.id);
            });
    }

    private async get() : Promise<GameInfo[]>{
        return [{id: "1", userIds:["2"]}]
    }

    private async getById(id: string): Promise<GameDetailsResponse> {
        return {id: "1", userIds:["2"]};
    }

    private async post(model: CreateGameRequest): Promise<CreateGameResponse> {
        return {id: "1"};
    }

    private async postInvite(model: InviteGameRequest): Promise<InviteGameResponse> {
        return {};
    }

    private async postAccept(id: string, model: AcceptGameRequest): Promise<AcceptGameResponse> {
        return {};
    }

    private async postDecline(id: string, model: DeclineGameRequest): Promise<DeclineGameResponse> {
        return {};
    }

    private async put(id: string, model: UpdateGameRequest): Promise<UpdateGameResponse> {
        return {};
    }

    private async del(id: string): Promise<DeleteGameResponse> {
        return {};
    }
}