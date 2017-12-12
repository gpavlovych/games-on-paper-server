import {jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import * as Router from "koa-router";
import {Context} from "koa";
import {
    CreateGameRequest, CreateGameResponse, DeleteGameResponse,
    GameDetailsResponse,
    GameInfo, InviteGameRequest, UpdateGameRequest, UpdateGameResponse
} from "../models/game-controller-models";
import {ResponseWithStatus, ResponseStatus, RouteBase} from "./interfaces";
import {Database} from "../database";
import { currentId } from "async_hooks";
import { DocumentQuery } from "mongoose";
import { Game } from "../data/game";

export class GameRoutes extends RouteBase {
    constructor(private database: Database) {
        super();
    }

    register(router: Router) {
        const routePath = "/api/games";
        const routePathWithId = `${routePath}/:id`;
        const adminRoleName = "admin";
        router
            .get(routePath, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                this.patchWithStatus(ctx, await this.getAll());
            })
            .get(`${routePath}/yours`, jwtVerify, async (ctx: any) => {
                this.patchWithStatus(ctx, await this.getYours(ctx.state.user.userId));
            })
            .post(`${routePath}/invite`, jwtVerify, async (ctx: any) => {
                this.patchWithStatus(ctx, await this.postInvite(ctx.request.body, ctx.state.user.userId));
            })
            .post(`${routePathWithId}/accept`, jwtVerify, async (ctx: any) => {
                ctx.body = await this.postAccept(ctx.params.id, ctx.state.user.userId);
            })
            .post(`${routePathWithId}/decline`, jwtVerify, async (ctx: any) => {
                ctx.body = await this.postDecline(ctx.params.id, ctx.state.user.userId);
            })
            .post(routePath, jwtVerifyRole(adminRoleName),async (ctx: any) => {
                this.patchWithStatus(ctx, await this.post(ctx.request.body));
            })
            .get(routePathWithId, jwtVerify, async (ctx: any) => {
                this.patchWithStatus(ctx, await this.getById(ctx.params.id));
            })
            .put(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                this.patchWithStatus(ctx, await this.put(ctx.params.id, ctx.request.body));
            })
            .del(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                this.patchWithStatus(ctx, await this.del(ctx.params.id));
            });
    }

    private async getAll() : Promise<ResponseWithStatus<GameInfo[]>>{
        const result = await this.populateGameDetails(this.database.gameModel.find({}, "_id stats"));
        if (result && result.length > 0) {
            return {status: ResponseStatus.OK, responseBody: result};
        } else {
            return {status: ResponseStatus.NoContent};
        }
    }

    private async getYours(currentUserId: string) : Promise<ResponseWithStatus<GameInfo[]>> {
        const result = await this.populateGameDetails(this.database.gameModel
            .find({ 
                $or: [
                    {"invitedUsers": currentUserId}, 
                    {"acceptedUsers": currentUserId}
                ] 
            }, "_id stats")
        );
        if (result && result.length > 0) {
            return {status: ResponseStatus.OK, responseBody: result};
        } else {
            return {status: ResponseStatus.NoContent};
        }
    }

    private async getById(id: string): Promise<ResponseWithStatus<GameDetailsResponse>> {
        const response = await this.populateGameDetails(this.database.gameModel.findById(id, "_id stats data"));
        if (response) {
            return {status: ResponseStatus.OK, responseBody: response};
        } else {
            return {status: ResponseStatus.NotFound};
        }
    }

    private async post(model: CreateGameRequest): Promise<ResponseWithStatus<CreateGameResponse>> {
        const entity = new this.database.gameModel(model);
        await entity.save();
        return {status: ResponseStatus.Created, responseBody:{_id: entity._id}};
    }

    private async postInvite(model: InviteGameRequest, currentUserId: string): Promise<ResponseWithStatus<CreateGameResponse>> {
        const invitedUsers: string[] = model.users;
        const acceptedUsers: string[] = [currentUserId];
        this.remove(invitedUsers, (user: string)=>user === currentUserId, acceptedUsers);
        const entity = new this.database.gameModel({ gameDefinition: model.gameDefinition, invitedUsers: invitedUsers, acceptedUsers: acceptedUsers});
        await entity.save();
        return {status: ResponseStatus.Created, responseBody:{_id: entity._id}};
    }

    private async postAccept(id: string, currentUserId: string): Promise<UpdateGameResponse> {
        const target = await this.database.gameModel
            .findById(id, "_id invitedUsers acceptedUsers stats data");
        this.remove(target.invitedUsers, (user: any)=>user == currentUserId, target.acceptedUsers);
        await target.save();
        return target;
    }

    private async postDecline(id: string, currentUserId: string): Promise<UpdateGameResponse> {
        const target = await this.database.gameModel
            .findById(id, "_id invitedUsers acceptedUsers stats data");
        this.remove(target.invitedUsers, (user: any)=>user == currentUserId);
        await target.save();
        return target;
    }

    private async put(id: string, model: UpdateGameRequest): Promise<ResponseWithStatus<UpdateGameResponse>> {
        if (id !== model._id) {
            return {status: ResponseStatus.BadRequest};
        }
        const response = await this.database.gameModel.findByIdAndUpdate(id, model);
        if (response){
            return {
                status: ResponseStatus.OK,
                responseBody: response
            };
        } else {
            return {
                status: ResponseStatus.NotFound
            };
        }
    }

    private async del(id: string): Promise<ResponseWithStatus<DeleteGameResponse>> {
        const response = await this.database.gameModel.findByIdAndRemove(id);
        if (response) {
            return {
                status: ResponseStatus.OK,
                responseBody: response
            };
        } else {
            return {
                status: ResponseStatus.NotFound
            };
        }
    }

    private populateGameDetails<T>(query: DocumentQuery<T, Game>): DocumentQuery<T, Game> {
        return query
            .populate("gameDefinition", "_id displayName description")
            .populate("winner", "_id displayName")
            .populate("invitedUsers", "_id displayName")
            .populate("acceptedUsers", "_id displayName");
    }
}