import { Elysia } from "elysia";
import authRoutes from "./routes/auth";

// Create Elysia instance
const app = new Elysia()

// const db = new PrismaClient()

app.use(authRoutes)

// Start the server
app.listen(Bun.env.PORT || 8080)

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
