import {IMiddleware} from "koa-router";
import {Context} from "koa";

export const createdStatus: IMiddleware = (ctx: Context, next: () => Promise<any>) => {
  if (ctx.body) {
      ctx.status = 201;
  }
};