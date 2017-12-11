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
import {CustomRoutes} from "./interfaces";
import {Database} from "../database";
import { currentId } from "async_hooks";

export class GameRoutes implements CustomRoutes {
    constructor(private database: Database) {}

    register(router: Router) {
        const routePath = "/api/games";
        const routePathWithId = `${routePath}/:id`;
        const adminRoleName = "admin";
        router
            .get(routePath, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                ctx.body = await this.getAll();
            })
            .get(`${routePath}/yours`, jwtVerify, async (ctx: any) => {
                ctx.body = await this.getYours(ctx.state.user.userId);
            })
            .get(routePathWithId, jwtVerify, async (ctx: any) => {
                ctx.body = await this.getById(ctx.params.id);
            })
            .post(`${routePath}/invite`, jwtVerify, async (ctx: any) => {
                ctx.body =  await this.postInvite(ctx.request.body);
            }, createdStatus)
            .post(`${routePathWithId}/accept`, jwtVerify, async (ctx: any) => {
                ctx.body =  await this.postAccept(ctx.params.id, ctx.request.body);
            })
            .post(`${routePathWithId}/decline`, jwtVerify, async (ctx: any) => {
                ctx.body = await this.postDecline(ctx.params.id, ctx.request.body);
            })
            .post(routePath, jwtVerifyRole(adminRoleName),async (ctx: any) => {
                ctx.body = await this.post(ctx.request.body);
            }, createdStatus)
            .put(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                ctx.body = await this.put(ctx.params.id, ctx.request.body);
            })
            .del(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                ctx.body = await this.del(ctx.params.id);
            });
    }

    private async getAll() : Promise<GameInfo[]>{
        return await this.database.gameModel
            .find({}, "_id stats")
            .populate("gameDefinition", "_id displayName")
            .populate("winner", "_id displayName")
            .populate("users", "_id displayName");
    }

    private async getYours(currentUserId: string) : Promise<GameInfo[]>{
        console.log(currentUserId);
        return await this.database.gameModel
            .find({"users": currentUserId}, "_id stats")
            .populate("gameDefinition", "_id displayName")
            .populate("winner", "_id displayName")
            .populate("users", "_id displayName");
    }

    private async getById(id: string): Promise<GameDetailsResponse> {
        return await this.database.gameModel
            .findById(id, "_id stats data")
            .populate("gameDefinition", "_id displayName description")
            .populate("winner", "_id displayName")
            .populate("users", "_id displayName");
    }

    private async post(model: CreateGameRequest): Promise<CreateGameResponse> {
        const entity = new this.database.gameModel(model);
        await entity.save();
        return {_id: entity._id};
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
        return await this.database.gameModel.findByIdAndUpdate(id, model);
    }

    private async del(id: string): Promise<DeleteGameResponse> {
        return await this.database.gameModel.findByIdAndRemove(id);
    }
}