import {sql} from "bun";

// @ts-ignore

async function searchIfUserExists(username: string, email: string): Promise<boolean> {
    const [user] = await sql`
        SELECT 1 FROM users WHERE username = ${username} OR email = ${email} LIMIT 1
    `;
    return user !== undefined;
}
async function registerInsertAUser(data: { username: string, firstName: string, lastName: string, email: string, password: string }): Promise<void> {
    const hash = await Bun.password.hash(data.password);
    const [user] = await sql`
        INSERT INTO users (username, first_name, last_name, email, password_hash)
        VALUES (${data.username}, ${data.firstName}, ${data.lastName}, ${data.email}, ${hash})
        RETURNING *
    `;
}

async function checkUserAuth(username: string, password: string): Promise<boolean> {
    const [user] = await sql`
        SELECT password_hash FROM users WHERE username = ${username}
    `;
    if (!user) {
        return false;
    }
    return await Bun.password.verify(password, user.password_hash);
}

async function getEmailWithUsername(username: string): Promise<string> {
    const [user] = await sql`
        SELECT email FROM users WHERE username = ${username}
    `;
    return user.email;
}

export {
    registerInsertAUser,
    searchIfUserExists,
    checkUserAuth,
    getEmailWithUsername
}