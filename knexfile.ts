const config = {
  development: {
    client: "postgresql",
    connection: {
      database: "trackingDB",
      host: "localhost",
      port: 5435,
      user: "postgres",
      password: "password",
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
      log: console.log,
    },
  },
};

export default config;
