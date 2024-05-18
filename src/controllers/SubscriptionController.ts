import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import {
  SubscriptionBody,
  SubscriptionStatus,
} from "../model/app/subscription";
import { jwt } from "../libs/jwt";

const db = new PrismaClient();

enum Status {
  ACTIVE,
  INACTIVE,
}

export const addSubscription = async (c: Context) => {
  try {
    const { name, amount, tag, status } = c.body as SubscriptionBody;
    if (!c.body) {
      c.set.status = 500;
      return {
        success: false,
        message: "No body provided",
      };
    }

    let decoded;
    let user;
    if (
      c.headers.authorization &&
      c.headers.authorization.startsWith("Bearer")
    ) {
      const token = c.headers.authorization.split(" ")[1];
      decoded = await jwt.verify(token);
    }

    if (!c.headers.authorization) {
      c.set.status = 500;
      return {
        success: false,
        message: "No authorization",
        data: null,
      };
    }

    if (decoded) {
      user = await db.user.findFirst({
        where: {
          email: `${decoded.email}`,
        },
        select: {
          id: true,
        },
      });
    }

    if (!user) {
      return {
        code: 404,
        success: true,
        message: "User not found!",
      };
    }

    const newSubscription = await db.subscription.create({
      data: {
        userId: user.id,
        name,
        amount,
        tag,
        status: (status as SubscriptionStatus) ?? SubscriptionStatus.ACTIVE,
      },
    });

    if (!newSubscription) {
      return {
        code: 400,
        success: true,
        message: "Invalid subscription data!",
      };
    }

    c.set.status = 201;
    return {
      success: true,
      message: "Subscription has been created!",
    };
  } catch (error) {
    c.set.status = 500;
    return {
      success: false,
      message: error,
    };
  }
};
