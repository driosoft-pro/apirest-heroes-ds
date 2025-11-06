import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

let dbConfig = {};

if (process.env.DB_ENV === "remote") {
  dbConfig = {
    database: process.env.DB_REMOTE_NAME,
    username: process.env.DB_REMOTE_USER,
    password: process.env.DB_REMOTE_PASSWORD,
    host: process.env.DB_REMOTE_HOST,
    port: process.env.DB_REMOTE_PORT,
    dialect: process.env.DB_REMOTE_DIALECT,
  };
} else {
  dbConfig = {
    database: process.env.DB_LOCAL_NAME,
    username: process.env.DB_LOCAL_USER,
    password: process.env.DB_LOCAL_PASSWORD,
    host: process.env.DB_LOCAL_HOST,
    port: process.env.DB_LOCAL_PORT,
    dialect: process.env.DB_LOCAL_DIALECT,
  };
}

export const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    logging: false,
  },
);
