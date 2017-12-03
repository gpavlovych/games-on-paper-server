import * as KoaJwt from "koa-jwt";
import * as JwtFunc from "jsonwebtoken";
import {IMiddleware} from "koa-router";
import {Context} from "koa";
import * as compose from "koa-compose";

const secretKey = "very secret key";
export const expiresInSeconds = 3000;
export const jwtVerify = KoaJwt({secret: secretKey });
export const jwtVerifyRole =
    (...roleNames: string[]): IMiddleware => compose([jwtVerify, async (ctx:Context, next: () => Promise<any>)=> {
        const roleName = ctx.state.user.roleName;
        if (roleNames.indexOf(roleName) >= 0) {
            await next();
        } else {
            ctx.throw(403)
        }
    }]);

export const jwtSign = (userId: string, userRole: string) =>
    JwtFunc.sign({userId: userId, roleName: userRole}, secretKey, {'expiresIn': expiresInSeconds});