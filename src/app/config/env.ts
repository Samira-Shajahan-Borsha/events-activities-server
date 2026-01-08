import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
    PORT: string;
    DB_URL: string;
    NODE_ENV: "development" | "production";
    BCRYPT_SALT_ROUND: string;
    SUPER_ADMIN_EMAIL: string;
    SUPER_ADMIN_PASSWORD: string;
    JWT_ACCESS_TOKEN_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRES: string;
    JWT_REFRESH_TOKEN_SECRET: string;
    JWT_REFRESH_TOKEN_EXPIRES: string;
    CLOUDINARY: {
        CLOUDINARY_CLOUD_NAME: string;
        CLOUDINARY_API_KEY: string;
        CLOUDINARY_API_SECRET: string;
    };
}

const loadEnvVariables = (): EnvConfig => {
    const requiredEnvVariables: string[] = [
        "PORT",
        "DB_URL",
        "NODE_ENV",
        "BCRYPT_SALT_ROUND",
        "SUPER_ADMIN_EMAIL",
        "SUPER_ADMIN_PASSWORD",
        "JWT_ACCESS_TOKEN_SECRET",
        "JWT_ACCESS_TOKEN_EXPIRES",
        "JWT_REFRESH_TOKEN_SECRET",
        "JWT_REFRESH_TOKEN_EXPIRES",
        "CLOUDINARY_CLOUD_NAME",
        "CLOUDINARY_API_KEY",
        "CLOUDINARY_API_SECRET",
    ];

    requiredEnvVariables.forEach((key) => {
        if (!process.env[key]) {
            throw new Error(`Missing require env variable ${key}`);
        }
    });

    return {
        PORT: process.env.PORT as string,
        DB_URL: process.env.DB_URL as string,
        NODE_ENV: process.env.NODE_ENV as "development" | "production",
        BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
        SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET as string,
        JWT_ACCESS_TOKEN_EXPIRES: process.env.JWT_ACCESS_TOKEN_EXPIRES as string,
        JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET as string,
        JWT_REFRESH_TOKEN_EXPIRES: process.env.JWT_REFRESH_TOKEN_EXPIRES as string,
        CLOUDINARY: {
            CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
            CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
            CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
        },
    };
};

export const envVars = loadEnvVariables();
