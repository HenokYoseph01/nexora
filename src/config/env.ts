import dotenv from "dotenv";
dotenv.config();

interface ENv {
    PORT: number;
}

export const env: ENv = {
    PORT: typeof(process.env.PORT) === 'number' ? process.env.PORT : 3000,
};

