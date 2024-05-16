import { PrismaClient } from "@prisma/client";
import { Context } from "elysia";
import { SignUpBody, SignInBody } from "../model/authModel";
import { comparePassword, hashPassword } from "../libs/bcrypt";
import { jwt } from "../libs/jwt";

const db = new PrismaClient();

export const createUser = async (c: Context) => {
  const { email, firstname, lastname, phone, password } = c.body as SignUpBody;
  if (!c.body) {
    c.set.status = 500;
    return {
      success: false,
      message: "No body provided",
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
      message: "Email all ready in use",
    };
  }

  const { hash, salt } = await hashPassword(password);

  const newUser = await db.user.create({
    data: {
      email,
      firstname,
      lastname,
      phone,
      salt,
      hash,
    },
  });

  if (!newUser) {
    c.set.status = 500;
    return {
      success: true,
      message: "Invalid user data!",
    };
  }

  c.set.status = 201;
  return {
    success: true,
    message: "User created successfully",
  };
};

export const signIn = async (c: Context) => {
  const { email, password } = c.body as SignInBody;
  if (!c.body) {
    c.set.status = 500;
    return {
      success: false,
      message: "No body provided",
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
      message: "Invalid email!",
      data: null,
    };
  }

  // verify password
  const match = await comparePassword(password, user.salt, user.hash);
  if (!match) {
    c.set.status = 201;
    return {
      success: false,
      message: "Invalid password!",
      data: null,
    };
  }

  const dataToken = {
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
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
    message: "User Sign Up",
    data: {
      accessToken,
      refreshToken,
    },
  };
};

export const userInfo = async (c: Context) => {
  // Get user id from token
  let decoded;
  let user;
  if (c.headers.authorization && c.headers.authorization.startsWith("Bearer")) {
    const token = c.headers.authorization.split(" ")[1];
    decoded = await jwt.verify(token);
  }
  if (decoded) {
    user = await db.user.findFirst({
      where: {
        email: `${decoded.email}`,
      },
      select: {
        firstname: true,
        lastname: true,
        email: true,
        phone: true,
      },
    });
  }

  return {
    success: true,
    message: "Fetch authenticated user details",
    data: {
      ...user,
    },
  };
};
