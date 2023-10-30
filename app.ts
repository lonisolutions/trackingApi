import Fastify, { FastifyInstance } from "fastify";
import trackingRoutes from "./routes/trackingRoutes";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "./helpers/errors";

const buildApp = async (): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
      },
    },
  });

  app.setErrorHandler((error, request, reply) => {
    if (error instanceof BadRequestError) {
      reply.status(400).send({ error: error.message });
    } else if (error instanceof NotFoundError) {
      reply.status(404).send({ error: error.message });
    } else if (error instanceof InternalServerError) {
      reply.status(500).send({ error: error.message });
    } else {
      reply.status(500).send({ error: "Unknown error" });
    }
  });

  app.register(trackingRoutes, { prefix: "/tracking" });

  return app;
};

export default buildApp;
