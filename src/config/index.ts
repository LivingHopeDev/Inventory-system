import dotenv from "dotenv";
dotenv.config();

const config = {
    port: process.env.PORT ?? 8000,
    NODE_ENV: process.env.NODE_ENV,
    TOKEN_SECRET: process.env.AUTH_SECRET,
    TOKEN_EXPIRY: process.env.AUTH_EXPIRY,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_SERVICE: process.env.SMTP_SERVICE,
    SMTP_PORT: process.env.SMTP_PORT,
}

export default config
