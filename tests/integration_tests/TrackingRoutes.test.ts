import { FastifyInstance } from "fastify";
import knexInstance from "../../db/index";
import buildApp from "../../app";
import trackingRoutes from "../../routes/trackingRoutes";

let server: FastifyInstance;
describe("Integration Tests for Tracking Routes", () => {
  beforeAll(async () => {
    console.log = jest.fn();

    await knexInstance.migrate.latest();
    await knexInstance.seed.run();

    server = await buildApp("silent");
    await server.register(trackingRoutes);
  });

  afterAll(async () => {
    await knexInstance.destroy();
    await server.close();
  });

  it("should get tracking and weather information", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
      query: {
        trackingNumber: "TN12345679",
        carrier: "ups",
      },
    });

    expect(response.statusCode).toBe(200);
    const payload = JSON.parse(response.payload);
    expect(payload).toHaveProperty("shipments");
    expect(payload).toHaveProperty("weather");
    expect(payload.shipments).toHaveLength(1);
    expect(payload.weather.receiver_city.city).toBe("Brussels");
    expect(payload.weather.sender_city.city).toBe("Hamburg");
    expect(payload.shipments[0].status).toBe("inbound-scan");
  });

  it("should return Bad Request if either tracking or carrier is missing", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
      query: {
        carrier: "ups",
      },
    });

    expect(response.statusCode).toBe(400);
    const payload = JSON.parse(response.payload);
    expect(payload.error).toBe(
      "Both trackingNumber and carrier must be provided"
    );
  });

  it("should handle not found for unknown tracking and carrier", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/",
      query: {
        trackingNumber: "TNUNKNOWN",
        carrier: "unknown",
      },
    });

    expect(response.statusCode).toBe(404);
    const payload = JSON.parse(response.payload);
    expect(payload.shipments).toBeUndefined();
    expect(payload.weather).toBeUndefined();
  });
});
