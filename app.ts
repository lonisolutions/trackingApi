import Fastify, { FastifyInstance } from "fastify";
import trackingRoutes from "./routes/trackingRoutes";

const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.register(trackingRoutes, { prefix: "/tracking" });
  app.get("/", async () => {
    return { hello: "world" };
  });

  return app;
};

export default buildApp;
