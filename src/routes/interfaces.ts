import * as Router from "koa-router";

export enum ResponseStatus {
    OK = 200,
    Created = 201,
    NoContent = 204,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404
}

export interface ResponseWithStatus<T> {
    status: ResponseStatus;
    responseBody?: T;
}

export abstract  class RouteBase {
    abstract register(router: Router): void;

    protected patchWithStatus<T>(ctx: any, response: ResponseWithStatus<T>) {
        ctx.body = response.responseBody;
        ctx.status = response.status;
    }

    protected patch<T>(ctx: any, response: T) {
        ctx.body = response;
    }
  
    protected remove<T>(source: T[], criteria: (sourceItem: T) => boolean, target?: T[]) {
        for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
            const sourceItem = source[sourceIndex];
            if (criteria(sourceItem)) {
                source.splice(sourceIndex, 1);
                if (typeof target !== 'undefined') {
                    target.push(sourceItem);
                }
                sourceIndex--;
            }
        }
    }
}

