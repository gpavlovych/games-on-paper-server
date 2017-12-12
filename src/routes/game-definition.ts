import {jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import * as Router from "koa-router";
import {Context} from "koa";
import {GameDefinitionDetails, GameDefinitionInfo,
    UpdateGameDefinitionRequest,
    UpdateGameDefinitionResponse
} from "../models/game-definition-controller-models";
import {Database} from "../database";
import { ResponseWithStatus, ResponseStatus, RouteBase } from "./interfaces";

export class GameDefinitionRoutes extends RouteBase {

    constructor(private database: Database) {
        super();
    }

    public register(router: Router) {
        const routePath = "/api/game-definitions";
        const routePathWithId = `${routePath}/:id`;
        const adminRoleName = "admin";
        router
            .get(routePath, jwtVerify, async (ctx: Context) => {
                this.patchWithStatus(ctx, await this.get());
            })
            .get(routePathWithId, jwtVerify, async (ctx: Context) => {
                this.patchWithStatus(ctx, await this.getById(ctx.params.id));
            })
            .put(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: any) => {
                this.patchWithStatus(ctx, await this.put(ctx.params.id, ctx.request.body));
            });
    }

    private async get() : Promise<ResponseWithStatus<GameDefinitionInfo[]>> {
        const response = await this.database.gameDefinitionModel.find({}, "_id pictureUrl displayName description");
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

    private async getById(id: string): Promise<ResponseWithStatus<GameDefinitionDetails>> {
        const response = await this.database.gameDefinitionModel.findById(id, "_id pictureUrl displayName description");
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

    private async put(id: string, model: UpdateGameDefinitionRequest): Promise<ResponseWithStatus<UpdateGameDefinitionResponse>> {
        const response = await this.database.gameDefinitionModel.findByIdAndUpdate(id, model);
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
}