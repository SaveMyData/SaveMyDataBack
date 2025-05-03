import { registerInsertAUser, searchIfUserExists } from "../db.ts";
import { Router } from "@oak/oak";

const registerRoutes = (router: Router) => {
    router
        .post("/api/auth/register", async (ctx) => {
            const { username, firstName, lastName, email, password } = await ctx.request.body.json();

            if (!username || !firstName || !lastName || !email || !password) {
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
                    lastName: lastName,
                    email: email,
                    firstName: firstName,
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
            ctx.response.body = { message: "User registered successfully" };
        });
};

export default registerRoutes;