import * as Router from "koa-router";

export interface CustomRoutes {
    register(router: Router): void;
}