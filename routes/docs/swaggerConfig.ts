export const swaggerOptions = {
  routePrefix: "/documentation",
  swagger: {
    info: {
      title: "Shipment Tracking API",
      description: "API documentation for shipment tracking service.",
      version: "1.0.0",
    },
    host: "localhost:3000",
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
  exposeRoute: true,
};
