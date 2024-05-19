import { Elysia } from "elysia";
import authRoutes from "./routes/auth";
import { swagger } from "@elysiajs/swagger";
import { swaggerConfig } from "./libs/swagger";
import cors from "@elysiajs/cors";
import subscriptionRoutes from "./routes/subscription";

// Create Elysia instance
const app = new Elysia();

// Use Swagger
app.use(swagger(swaggerConfig));

// Route Group
app.use(authRoutes);
app.use(subscriptionRoutes);

// Use Cors
app.use(cors())

// Start the server
app.listen(Bun.env.PORT || 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
