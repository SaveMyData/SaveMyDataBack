import { registerInsertAUser, searchIfUserExists, checkUserAuth, getEmailWithUsername } from "../db.ts";
import { generateAToken } from "../utils.ts";
import { Router } from "@oak/oak";

const loginRoutes = (router: Router) => {
    router
        .post("/api/auth/login", async (ctx) => {
            const { username, password } = await ctx.request.body.json();

            if (!username || !password) {
                ctx.response.status = 400;
                ctx.response.body = { error: "Missing required fields" };
                return;
            }
            try {
                if (await checkUserAuth(username, password)) {
                    ctx.response.status = 200;
                    const token = await generateAToken(username, await getEmailWithUsername(username));
                    ctx.response.headers.set(
                        "Set-Cookie",
                        `auth-token=${token}; HttpOnly; SameSite=Strict; Path=/`
                    );
                    ctx.response.body = {token: token};
                } else {
                    ctx.response.status = 401;
                    ctx.response.body = {error: "Invalid username or password"};
                }
            } catch (error) {
                ctx.response.status = 500;
                ctx.response.body = {error: "Internal Server Error"};
            }
        });
};

export default loginRoutes;