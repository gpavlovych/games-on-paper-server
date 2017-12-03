import * as Router from "koa-router";
import * as bcrypt from "bcrypt";
import {Context} from "koa";
import {
    UserDetailsResponse, UserInfo, LoginRequest,
    LoginResponse, RegisterRequest, PutUserRequest, RegisterResponse, PutUserResponse, DeleteUserResponse
} from "../models/user-controller-models";
import {expiresInSeconds, jwtSign, jwtVerify, jwtVerifyRole} from "../middleware/jwt";
import {createdStatus} from "../middleware/status";
import {openMongoose, User} from "../data/index";

const saltRounds = 10;

export class UserController {

    constructor() {
    }

    public registerRoutes(router: Router) {
        router
            .get("/api/users", jwtVerify, async (ctx: Context) => {
                ctx.body = await this.get();
            })
            .get("/api/users/:id", jwtVerifyRole("admin"), async (ctx: Context) => {
                ctx.body = await this.getById(ctx.params.id);
            })
            .post("/api/users", async (ctx: Context) => {
                ctx.body = await this.register(ctx.request.body);
            }, createdStatus)
            .post("/api/users/login", async (ctx: Context) => {
                ctx.body = await this.login(ctx.request.body);
            })
            .put("/api/users/:id", jwtVerify, async (ctx: Context) => {
                this.verifyOwnOrAdmin(ctx);
                //do whatever
                ctx.body = await this.put(ctx.params.id, ctx.request.body);
            })
            .del("/api/users/:id", jwtVerify, async (ctx: Context) => {
                this.verifyOwnOrAdmin(ctx);
                //do whatever
                ctx.body = await this.del(ctx.params.id);
            });
    }

    private verifyOwnOrAdmin(ctx: Context) {
        if (ctx.params.id !== ctx.state.user.userId && "admin" !== ctx.state.user.roleName) {
            ctx.throw(403);
        }
    }

    private async get(): Promise<UserInfo[]> {
        let conn = openMongoose();
        let users = User(conn).find();
        conn.close();
        return [{id: "1", displayName: "string", email: "string"}];
    }

    private async getById(id: string): Promise<UserDetailsResponse> {
        return {id: "1", displayName: "string", email: "string", games: []};
    }

    private async register(model: RegisterRequest): Promise<RegisterResponse> {
        const passwordHash = await bcrypt.hash(model.password, saltRounds);
        return {userId: "1"};
    }

    private async login(ctx: Context) {
        const model: LoginRequest = ctx.request.body;
        const userId = "1";
        const userDisplayName = "some name";
        const userPasswordHash = "d";
        let userRoleName = "admin";
        if (model.email !== "admin@email.com") {
            userRoleName = "guest";
        }
        if (await bcrypt.compare(model.password, userPasswordHash)) {
            ctx.status = 200;
            const responseBody: LoginResponse = {
                userId: userId, // replace with live
                userDisplayName: userDisplayName, //add whatever
                token: jwtSign(userId, userRoleName),
                expiresInSeconds: expiresInSeconds
            };
            ctx.body = responseBody;
            console.log(`Issued the token ${JSON.stringify(responseBody)}`);
        }
        else {
            ctx.status = 401;
            console.log(`Invalid username and/or password`);
        }
    }

    private async put(id: string, model: PutUserRequest): Promise<PutUserResponse> {
        return {id: "12", displayName: "123", email: "123"};
    }

    private async del(id: string): Promise<DeleteUserResponse> {
        return {id: "12", displayName: "123", email: "123"};
    }
}