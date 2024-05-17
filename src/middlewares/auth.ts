import { Context } from "elysia";
import { jwt } from "../libs/jwt";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// Middleware to protect routes with JWT
export const auth: any = async (c: Context) => {
  let token;
  if (c.headers.authorization && c.headers.authorization.startsWith("Bearer")) {
    try {
      token = c.headers.authorization.split(" ")[1];
      const decoded = await jwt.verify(token);
      const user = await db.user.findFirst({
        where: {
          email: `${decoded.email}`,
        },
      });
      if (user) {
        c.request.headers.set("userEmail", user.email);
        c.request.headers.set("userRole", user.role);
      }
    } catch (error) {
      c.set.status = 401;
      throw new Error("Not authorized, Invalid token!");
    }
  }

  if (!token) {
    c.set.status = 401;
    throw new Error("Not authorized, No token found!");
  }
};

// Middleware to protect routes with JWT and protect routes for admin only
export const admin: any = async (c: Context) => {
  await auth(c);

  const userRole = c.request.headers.get("userRole");

  if (!userRole || userRole === "USER") {
    c.set.status = 401;
    return {
      success: false,
      message: "Not authorized as an Admin!",
    };
  }
};
