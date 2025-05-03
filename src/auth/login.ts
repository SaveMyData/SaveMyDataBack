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
            if (await checkUserAuth(username, password)) {
                ctx.response.status = 200;
                ctx.response.body = { token: await generateAToken(username, await getEmailWithUsername(username)) };
            } else {
                ctx.response.status = 401;
                ctx.response.body = { error: "Invalid username or password" };
            }
        });
};

export default loginRoutes;