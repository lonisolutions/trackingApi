import { FastifyInstance, RouteShorthandOptions } from "fastify";
import TrackingService from "../service/TrackingService";
import { CurrentWeather, Shipment } from "types";
import WeatherService from "../service/WeatherService";

type GetTrackingResponse = {
  shipments: Shipment[];
  weather: CurrentWeather;
};

type GetTrackingQuery = {
  trackingNumber?: string;
  carrier?: string;
};

const routeOptions: RouteShorthandOptions = {
  schema: {
    querystring: {
      type: "object",
      properties: {
        trackingNumber: { type: "string", nullable: false },
        carrier: { type: "string", nullable: false },
      },
    },
    response: {
      200: {
        type: "object",
        properties: {
          shipments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "number" },
                trackingNumber: { type: "string" },
                carrier: { type: "string" },
                sender_address: { type: "string" },
                receiver_address: { type: "string" },
                article_name: { type: "string" },
                article_quantity: { type: "string" },
                article_price: { type: "string" },
                SKU: { type: "string" },
                status: { type: "string" },
              },
            },
          },
          weather: {
            type: "object",
            properties: {
              receiver_city: {
                type: "object",
                properties: {
                  postal_code: { type: "string" },
                  city: { type: "string" },
                  temperature: { type: "number" },
                  description: { type: "string" },
                },
              },
              sender_city: {
                type: "object",
                properties: {
                  postal_code: { type: "string" },
                  city: { type: "string" },
                  temperature: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default async function trackingRoutes(fastify: FastifyInstance) {
  const trackingService = new TrackingService();
  const weatherService = new WeatherService();
  fastify.get("/", routeOptions, async (request, reply) => {
    const { trackingNumber, carrier } = request.query as GetTrackingQuery;

    if (!trackingNumber || !carrier) {
      return reply.status(400).send({
        error: "Both trackingNumber and carrier must be provided",
      });
    }

    const shipments =
      await await trackingService.findByTrackingNumberAndCarrier(
        trackingNumber,
        carrier
      );

    if (shipments.length === 0) {
      return reply.status(404).send({
        error: "No shipments found",
      });
    }

    const receiverWeather = await weatherService.getWeather(
      shipments[0].receiver_postal_code,
      shipments[0].receiver_city
    );
    const senderWeather = await weatherService.getWeather(
      shipments[0].sender_postal_code,
      shipments[0].sender_city
    );

    const response: GetTrackingResponse = {
      shipments: shipments,
      weather: { receiver_city: receiverWeather, sender_city: senderWeather },
    };

    return reply.send(response);
  });
}
