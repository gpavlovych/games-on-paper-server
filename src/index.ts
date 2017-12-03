import * as Koa from "koa";
import * as Router from "koa-router";
import {UserController} from "./controllers/user-controller";
import bodyParser = require("koa-bodyparser");
import {GameController} from "./controllers/game-controller";
import {GameDefinitionController} from "./controllers/game-definition-controller";
import * as dotenv from "dotenv";
import {initMongooose} from "./data/index";

// process.env.VARIABLE_NAME is set from .env file
dotenv.config();

initMongooose();

const app = new Koa();

app.use(bodyParser());
app.use(async (ctx, next) => {
    // Log the request to the console
    console.log('Url:', ctx.url);
    // Pass the request to the next middleware function
    await next();
});
const router = new Router();

new UserController().registerRoutes(router);
new GameController().registerRoutes(router);
new GameDefinitionController().registerRoutes(router);

app.use(router.routes());

app.listen(3000);

console.log('Server running on port 3000');