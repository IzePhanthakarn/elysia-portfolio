import Elysia, { t } from "elysia";
import { createUser, getAccessToken, signIn, userInfo } from "../controllers/AuthController";
import { auth } from "../middlewares/auth";

const authRoutes = (app: Elysia) => {
  app.group("/auth", (app) =>
    app
      .post("/signup", createUser, {
        body: t.Object({
          firstname: t.String(),
          lastname: t.String(),
          email: t.String(),
          phone: t.String(),
          password: t.String(),
        }),
        detail: {
          tags: ["Auth"],
        },
      })

      .post("/signin", signIn, {
        body: t.Object({
          email: t.String(),
          password: t.String(),
        }),
        detail: {
          tags: ["Auth"],
        },
      })

      .get("/userInfo", userInfo, {
        beforeHandle: (c) => auth(c),
        detail: {
          security: [{ bearer: [] }],
          tags: ["Auth"],
        },
      })

      .get("/getAccessToken", getAccessToken, {
        beforeHandle: (c) => auth(c),
        detail: {
          security: [{ bearer: [] }],
          tags: ["Auth"],
        },
      })
  );
};
export default authRoutes as any;
