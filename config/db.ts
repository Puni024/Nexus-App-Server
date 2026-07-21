import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
    process.env.DB_NAME!,
    process.env.DB_USER!,
    process.env.DB_PASSWORD!,
    {
        host: process.env.DB_HOST!,
        port: parseInt(process.env.DB_PORT!),
        dialect: "postgres",
        dialectOptions: {
            dialectOptions: {
                ssl:
                    process.env.NODE_ENV === "production"
                        ? {
                            require: true,
                            rejectUnauthorized: false,
                        }
                        : false,
            },
        },
        logging: false, // optional, quiets Sequelize's SQL logging
    }
);
