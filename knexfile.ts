import { config as dotenvConfig } from "dotenv";

dotenvConfig();

type ConfigKey = "development" | "test";
const dbEnv = (process.env.DB_ENV || "development") as ConfigKey;

const config = {
  development: {
    client: "postgresql",
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
      log: console.log,
    },
  },
  test: {
    client: "sqlite3",
    connection: {
      filename: ":memory:",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
      log: console.log,
    },
  },
};

export default config[dbEnv];
