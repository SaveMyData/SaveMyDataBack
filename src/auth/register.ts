import {getEmailWithUsername, registerInsertAUser, searchIfUserExists} from "../db.ts";
import { Router } from "@oak/oak";
import {generateAToken} from "../utils.ts";

const registerRoutes = (router: Router) => {
    router
        .post("/api/auth/register", async (ctx) => {
            const { username, name, email, password } = await ctx.request.body.json();

            if (!username || !name || !email || !password) {
                ctx.response.status = 400;
                ctx.response.body = { error: "Missing required fields" };
                return;
            }
            try {
                if (await searchIfUserExists(username, email)) {
                    ctx.response.status = 409;
                    ctx.response.body = { error: "Username or email already exists" };
                    return;
                }
                await registerInsertAUser({
                    name: name,
                    email: email,
                    username: username,
                    password: password
                });
            } catch (error) {
                console.error("Error inserting user:", error);
                ctx.response.status = 500;
                ctx.response.body = { error: "Internal server error" };
                return;
            }
            ctx.response.status = 201;
            const token = await generateAToken(username, email);
            ctx.response.headers.set(
                "Set-Cookie",
                `auth-token=${token}; HttpOnly; SameSite=Strict; Path=/`
            );
            ctx.response.body = { token: token};
        });
};

export default registerRoutes;