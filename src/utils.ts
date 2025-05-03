import { encode } from "@hig/jwt";

async function generateAToken(username: string, email: string) {
    const payload = {
        username,
        email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };
    // @ts-ignore
    return await encode(payload, process.env.JWT_SECRET);
}

export { generateAToken };
