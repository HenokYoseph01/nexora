import dotenv from "dotenv";

dotenv.config();

interface Env {
    PORT: number;
}

const rawPort = process.env.PORT;
const port = rawPort === undefined ? 3000 : Number(rawPort);

if (rawPort !== undefined && !/^\d+$/.test(rawPort)) {
    throw new Error("PORT must contain only decimal digits.");
}

if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
}

export const env: Env = {
    PORT: port,
};
