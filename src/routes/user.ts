import * as Router from "koa-router";
import * as bcrypt from "bcrypt";
import {Context} from "koa";
import {
    UserDetailsResponse, UserInfo, LoginRequest,
    LoginResponse, RegisterRequest, PutUserRequest, RegisterResponse, PutUserResponse, DeleteUserResponse
} from "../models/user-controller-models";
import {expiresInSeconds, jwtSign, jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import { Database } from "../database";
import { User } from "../data/user";
import { encode } from "punycode";
import { RouteBase, ResponseWithStatus, ResponseStatus } from "./interfaces";
import { IMiddleware } from "koa-router";

const saltRounds = 10;

export class UserRoutes extends RouteBase {
    constructor (private database: Database){
        super();
    }

    register(router: Router) {
        const routePath = "/api/users";
        const routePathWithId = `${routePath}/:id`;
        const adminRoleName = "admin";

        router
            .get(routePath, jwtVerify, async (ctx: Context) => {
                this.patchWithStatus(ctx, await this.get());
            })
            .get(routePathWithId, jwtVerifyRole(adminRoleName), async (ctx: Context) => {
                this.patchWithStatus(ctx, await this.getById(ctx.params.id));
            })
            .post(routePath, async (ctx: any) => {
                this.patchWithStatus(ctx, await this.signUp(ctx.request.body));
            })
            .post(`${routePath}/login`, async (ctx: any) => {
                this.patchWithStatus(ctx, await this.signIn(ctx.request.body));
            })
            .put(routePathWithId, jwtVerify, this.verifyOwnOrRole(adminRoleName), async (ctx: any) => {
                this.patchWithStatus(ctx, await this.put(ctx.params.id, ctx.request.body));
            })
            .del(routePathWithId, jwtVerify, this.verifyOwnOrRole(adminRoleName), async (ctx: Context) => {
                this.patchWithStatus(ctx, await this.del(ctx.params.id));
            });
    }

    private verifyOwnOrRole = (roleName: string): IMiddleware => (ctx: Context) => {
        if (ctx.params.id !== ctx.state.user.userId && roleName !== ctx.state.user.roleName) {
            ctx.throw(ResponseStatus.Forbidden);
        }
    }

    private async get(): Promise<ResponseWithStatus<UserInfo[]>> {
        const result = await this.database.userModel.find({}, "_id displayName roleName");
        if (result && result.length > 0) {
            return {status: ResponseStatus.OK, responseBody: result};
        } else {
            return {status: ResponseStatus.NoContent};
        }
    }

    private async getById(id: string): Promise<ResponseWithStatus<UserDetailsResponse>> {
        const result = await this.database.userModel.findById(id);
        if (result) {
            return {status: ResponseStatus.OK, responseBody: result};
        } else {
            return {status: ResponseStatus.NotFound};
        }
    }

    private async signUp(model: RegisterRequest): Promise<ResponseWithStatus<RegisterResponse>> {
        const passwordHash = await bcrypt.hash(model.password, saltRounds);
        const entity = new this.database.userModel({  displayName: model.displayName,
            email: model.email,
            roleName: "player"});
        await entity.save();
        return {status: ResponseStatus.OK, responseBody: {userId: entity._id}};
    }

    private async signIn(model: LoginRequest): Promise<ResponseWithStatus<LoginResponse>> {
        const user = await this.database.userModel.findOne({email: model.email},"_id displayName passwordHash roleName");
        if (await bcrypt.compare(model.password, user.passwordHash)) {
            const response: LoginResponse = {
                userId: user._id, 
                userDisplayName: user.displayName,
                userRoleName: user.roleName, 
                token: jwtSign(user._id, user.roleName),
                expiresInSeconds: expiresInSeconds
            };
            return {
                status: ResponseStatus.OK,
                responseBody: response
            }
        }
        else {
            return {
                status: ResponseStatus.Unauthorized
            }
        }
    }

    private async put(id: string, model: PutUserRequest): Promise<ResponseWithStatus<PutUserResponse>> {
        const response = await this.database.userModel.findByIdAndUpdate(id, model);
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

    private async del(id: string): Promise<ResponseWithStatus<DeleteUserResponse>> {
        const response = await this.database.userModel.findByIdAndRemove(id);
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
}