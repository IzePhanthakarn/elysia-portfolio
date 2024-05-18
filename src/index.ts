import { Elysia } from "elysia";
import authRoutes from "./routes/auth";
import { swagger } from "@elysiajs/swagger";
import { swaggerConfig } from "./libs/swagger";
import cors from "@elysiajs/cors";

// Create Elysia instance
const app = new Elysia();

// Use Swagger
app.use(swagger(swaggerConfig));

// Route Group
app.use(authRoutes);

// Use Cors
app.use(cors())

// Start the server
app.listen(Bun.env.PORT || 8080);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
