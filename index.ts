import { Application, Router } from "@oak/oak";
import { sql } from "bun";
import { oakCors } from "@tajpouria/cors";
import { jwt } from '@elysiajs/jwt'
import registerRoutes from "./src/auth/register.ts";
import loginRoutes from "./src/auth/login.ts";

const router = new Router();

const app = new Application();

app.use(
    oakCors({
        origin: "http://127.0.0.1:5173",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        credentials: true,
        optionsSuccessStatus: 200,
    }),
);

// Apply routes after CORS middleware
app.use(router.routes());
app.use(router.allowedMethods());

registerRoutes(router);
loginRoutes(router);

console.log("Server is running on http://localhost:8080");
app.listen({port: 8080});