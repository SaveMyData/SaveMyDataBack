import { Application, Router } from "@oak/oak";
import { sql } from "bun";
import { oakCors } from "@tajpouria/cors";
import { jwt } from '@elysiajs/jwt'
import registerRoutes from "./src/auth/register.ts";
import loginRoutes from "./src/auth/login.ts";

const router = new Router();

const app = new Application()

app.use(oakCors({ origin: "*" }));

// Apply routes after CORS middleware
app.use(router.routes());
app.use(router.allowedMethods());

registerRoutes(router);
loginRoutes(router);

console.log("Server is running on http://localhost:8080");
app.listen({port: 8080});