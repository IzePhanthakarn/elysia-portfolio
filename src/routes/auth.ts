import Elysia, { t } from "elysia";
import { createUser, signIn, userInfo } from "../controllers/AuthController";

const authRoutes = (app: Elysia) => {
  app.group("/auth", (app) =>
    app
      .post("/signup", createUser,{
        body: t.Object({
            firstname: t.String(),
            lastname: t.String(),
            email: t.String(),
            phone: t.String(),
            password: t.String(),
        }),
        type: 'json',
      })
      
      .post("/signin", signIn,{
        body: t.Object({
            email: t.String(),
            password: t.String(),
        }),
        type: 'json',
      })

      .get("/userinfo", userInfo,{
        type: 'json',
      })
      
  );
};
export default authRoutes as any;
