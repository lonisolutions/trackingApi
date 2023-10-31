import Fastify, { FastifyInstance } from "fastify";
import trackingRoutes from "./routes/trackingRoutes";
import {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} from "./helpers/errors";
import { swaggerOptions } from "./routes/docs/swaggerConfig";
import swagger from "@fastify/swagger";
import TrackingService from "./service/TrackingService";
import WeatherService from "./service/WeatherService";

const buildApp = async (
  logLevel: string = "info"
): Promise<FastifyInstance> => {
  const app = Fastify({
    logger: {
      level: logLevel,
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

  app.register(swagger, swaggerOptions);

  const trackingService = new TrackingService();
  const weatherService = new WeatherService();

  await app.register(trackingRoutes, { trackingService, weatherService });

  return app;
};

export default buildApp;
