import { ElysiaSwaggerConfig } from "@elysiajs/swagger/dist/types";

export const swaggerConfig: ElysiaSwaggerConfig = {
  provider: "swagger-ui",
  documentation: {
    info: {
      title: "Elysia Portfolio Documentation",
      version: "1.0.0",
      description: "This is Documentation API for portfolio service.",
    },
    tags: [
      { name: "Auth", description: "Authentication endpoints" },
      { name: "Subscription", description: "Subscription endpoints" },
    ],
    components: {
      securitySchemes: {
        bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
};
