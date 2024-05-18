import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { SignUpBody, SignInBody } from "../model/authModel";
import { jwt } from "../libs/jwt";

const db = new PrismaClient();

export const createUser = async (c: Context) => {
  try {
    const { email, firstname, lastname, phone, password } =
      c.body as SignUpBody;
    if (!c.body) {
      c.set.status = 500;
      return {
        success: false,
        message: "no body provided",
      };
    }

    const isEmailAllReadyExist = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (isEmailAllReadyExist) {
      c.set.status = 500;
      return {
        success: false,
        message: "email all ready in use",
      };
    }

    const bcryptHash = await Bun.password.hash(password, {
      algorithm: "bcrypt",
      cost: 4,
    });

    const newUser = await db.user.create({
      data: {
        email,
        firstname,
        lastname,
        phone,
        password: bcryptHash,
      },
    });

    if (!newUser) {
      c.set.status = 500;
      return {
        success: true,
        message: "invalid user data!",
      };
    }

    c.set.status = 201;
    return {
      success: true,
      message: "create user successful!",
    };
  } catch (error) {
    c.set.status = 500;
    return {
      success: false,
      message: error,
    };
  }
};

export const signIn = async (c: Context) => {
  try {
    const { email, password } = c.body as SignInBody;
    if (!c.body) {
      c.set.status = 500;
      return {
        success: false,
        message: "no body provided",
        data: null,
      };
    }

    // verify email
    const user = await db.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      c.set.status = 500;
      return {
        success: false,
        message: "user not found!",
        data: null,
      };
    }

    // verify password
    const match = await Bun.password.verify(password, user.password);
    if (!match) {
      c.set.status = 201;
      return {
        success: false,
        message: "invalid password!",
        data: null,
      };
    }

    const dataToken = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    // generate access and refresh token
    const accessToken = await jwt.sign({
      data: dataToken,
      exp: "1h",
    });

    const refreshToken = await jwt.sign({
      data: dataToken,
      exp: "14d",
    });

    c.set.status = 201;
    return {
      success: true,
      message: "sign up successful!",
      data: {
        accessToken,
        refreshToken,
      },
    };
  } catch (error) {
    c.set.status = 500;
    return {
      success: false,
      message: error,
    };
  }
};

export const userInfo = async (c: Context) => {
  try {
    // Get user id from token
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
        message: "no authorization",
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
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
          role: true,
        },
      });
    }

    return {
      success: true,
      message: "fetch authenticated user details",
      data: {
        ...user,
      },
    };
  } catch (error) {
    c.set.status = 500;
    return {
      success: false,
      message: error,
    };
  }
};

export const getAccessToken = async (c: Context) => {
  try {
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
        message: "no authorization",
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
          firstname: true,
          lastname: true,
          email: true,
          phone: true,
          role: true,
        },
      });
    }

    if (!user) {
      c.set.status = 500;
      return {
        success: false,
        message: "user not found!",
        data: null,
      };
    }

    const dataToken = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
      role: user.role,
    };

    // generate access and refresh token
    const accessToken = await jwt.sign({
      data: dataToken,
      exp: "1h",
    });

    c.set.status = 200;
    return {
      success: true,
      message: "generate access token successful!",
      data: {
        accessToken
      }
    }
  } catch (error) {
    c.set.status = 500;
    return {
      success: false,
      message: error,
    };
  }
};
