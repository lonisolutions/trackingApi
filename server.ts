import buildApp from "./app";

const start = async () => {
  const app = await buildApp();

  try {
    const address = await app.listen({
      port: 3000,
      host: "127.0.0.1",
    });
    app.log.info(`Server listening on ${address}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
