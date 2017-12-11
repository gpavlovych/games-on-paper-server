import {jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import * as Router from "koa-router";
import {Context} from "koa";
import {createdStatus} from "../middleware/status";
import {GameDefinitionDetails, GameDefinitionInfo,
    UpdateGameDefinitionRequest,
    UpdateGameDefinitionResponse
} from "../models/game-definition-controller-models";
import {Database} from "../database";
import { CustomRoutes } from "./interfaces";

export class GameDefinitionRoutes implements CustomRoutes {

    constructor(private database: Database) {}

    public register(router: Router) {
        const routePath = "/api/game-definitions";
        const routePathWithId = `${routePath}/:id`;
        const adminRoleName = "admin";
        router
            .get(routePath, jwtVerify, async (ctx: Context) => {
                ctx.body = await this.get();
            })
            .get(routePathWithId, jwtVerify, async (ctx: Context) => {
                ctx.body = await this.getById(ctx.params.id);
            })
            .put(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: Context) => {
                ctx.body = await this.put(ctx.params.id, ctx.request.body);
            });
    }

    private async get() : Promise<GameDefinitionInfo[]> {
        return await this.database.gameDefinitionModel.find({}, "_id pictureUrl displayName description");
    }

    private async getById(id: string): Promise<GameDefinitionDetails> {
        return await this.database.gameDefinitionModel.findById({}, "_id pictureUrl displayName description");
    }

    private async put(id: string, model: UpdateGameDefinitionRequest): Promise<UpdateGameDefinitionResponse> {
        return await this.database.gameDefinitionModel.findByIdAndUpdate({}, model);
    }
}