///<reference path="../node_modules/@types/node/index.d.ts"/>
import * as dotenv from "dotenv";
import * as Koa from 'koa';
import * as body from 'koa-body';
import * as json from 'koa-json';
import * as Router from "koa-router";
import * as KoaJwt from "koa-jwt";
import {init, Database} from "./database";
import cors = require("koa2-cors");
import {UserRoutes} from "./routes/user";
import {GameDefinitionRoutes} from "./routes/game-definition";
import {GameRoutes} from "./routes/game";

const app = new Koa();

dotenv.config();
const secretKey: string = process.env.JWT_SECRET_KEY || "";
const jwt = KoaJwt({secret: secretKey});
app.use(body({
    formidable: {
        uploadDir: __dirname + '/public/uploads', // upload directory
        keepExtensions: true // keep file extensions
    },
    multipart: true,
    urlencoded: true,
}));
app.use(json());
app.use(cors());

const dbUrl = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
const dbUser = process.env.DB_USER;
const dbPwd = process.env.DB_PWD;
const router = new Router();

app
    .use(router.routes())
    .use(router.allowedMethods());

init({url: dbUrl, user: dbUser, pwd: dbPwd})
    .then((database:Database) => {
        new UserRoutes(database).register(router);
        new GameDefinitionRoutes(database).register(router);
        new GameRoutes(database).register(router);
    })
    .catch((reason?: any) => {
        console.log(`error while connecting to the db: ${reason}`);
    });


if (!module.parent) {
    const port = process.env.NODE_PORT || 8080;
    const host = process.env.NODE_HOST || "localhost";
    const protocol = process.env.NODE_PROTOCOL || "http";
    app.listen(port);
    console.log(`Node server started: ${protocol}://${host}:${port}/`);
}
else {
    console.log("Called from unit tests");
}

export default app;