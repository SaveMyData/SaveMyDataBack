import { Application, Router } from "@oak/oak";
import { sql } from "bun";
import { jwt } from '@elysiajs/jwt'
import registerRoutes from "./src/auth/register.ts";
import loginRoutes from "./src/auth/login.ts";

const router = new Router();
registerRoutes(router);
loginRoutes(router);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server is running on http://localhost:8080");
app.listen({port: 8080});