import * as Router from "koa-router";
import * as bcrypt from "bcrypt";
import {Context} from "koa";
import {
    UserDetailsResponse, UserInfo, LoginRequest,
    LoginResponse, RegisterRequest, PutUserRequest, RegisterResponse, PutUserResponse, DeleteUserResponse
} from "../models/user-controller-models";
import {expiresInSeconds, jwtSign, jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import {createdStatus} from "../middleware/status";
import {CustomRoutes} from "./interfaces";
import { Database } from "../database";
import { User } from "../data/user";
import { encode } from "punycode";

const saltRounds = 10;

export class UserRoutes implements CustomRoutes {
    constructor (private database: Database){}

    register(router: Router) {
        const routePath = "/api/users";
        const routePathWithId = `${routePath}/:id`;
        const adminRoleName = "admin";

        router
            .get(routePath, jwtVerify, async (ctx: Context) => {
                ctx.body = await this.get();
            })
            .get(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: Context) => {
                ctx.body = await this.getById(ctx.params.id);
            })
            .post(routePath, async (ctx: any) => {
                ctx.body = await this.signUp(ctx.request.body);
            }, createdStatus)
            .post(`${routePath}/login`, async (ctx: any) => {
                await this.signIn(ctx);
            })
            .put(routePathWithId, jwtVerify, async (ctx: any) => {
                this.verifyOwnOrRole(ctx, adminRoleName);
                ctx.body = await this.put(ctx.params.id, ctx.request.body);
            })
            .del(routePathWithId, jwtVerify, async (ctx: Context) => {
                this.verifyOwnOrRole(ctx, adminRoleName);
                ctx.body = await this.del(ctx.params.id);
            });
    }

    private verifyOwnOrRole(ctx: Context, roleName: string) {
        if (ctx.params.id !== ctx.state.user.userId && roleName !== ctx.state.user.roleName) {
            ctx.throw(403);
        }
    }

    private async get(): Promise<UserInfo[]> {
        return await this.database.userModel.find({}, "_id displayName roleName");
    }

    private async getById(id: string): Promise<UserDetailsResponse> {
        return await this.database.userModel.findById(id);
    }

    private async signUp(model: RegisterRequest): Promise<RegisterResponse> {
        const passwordHash = await bcrypt.hash(model.password, saltRounds);
        const entity = new this.database.userModel({  displayName: model.displayName,
            email: model.email,
            roleName: "player"});
        await entity.save();
        return {userId: entity._id};
    }

    private async signIn(ctx: any) {
        console.log(ctx);
        const model: LoginRequest = ctx.request.body;
        const user = await this.database.userModel.findOne({email: model.email},"_id displayName passwordHash roleName");
        if (await bcrypt.compare(model.password, user.passwordHash)) {
            ctx.status = 200;
            const responseBody: LoginResponse = {
                userId: user._id, 
                userDisplayName: user.displayName,
                userRoleName: user.roleName, 
                token: jwtSign(user._id, user.roleName),
                expiresInSeconds: expiresInSeconds
            };
            ctx.body = responseBody;
        }
        else {
            ctx.status = 401;
        }
    }

    private async put(id: string, model: PutUserRequest): Promise<PutUserResponse> {
        return await this.database.userModel.findByIdAndUpdate(id, model);
    }

    private async del(id: string): Promise<DeleteUserResponse> {
        return await this.database.userModel.findByIdAndRemove(id);
    }
}