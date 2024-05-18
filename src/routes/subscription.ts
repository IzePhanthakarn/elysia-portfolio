import Elysia, { t } from "elysia";
import { addSubscription } from "../controllers/SubscriptionController";
import { auth } from "../middlewares/auth";

const subscriptionRoutes = (app: Elysia) => {
  app.group("/app/subscription", (app) =>
    app
      .post("/add", addSubscription, {
        beforeHandle: (c) => auth(c),
        body: t.Object({
          firstname: t.String(),
          lastname: t.String(),
          email: t.String(),
          phone: t.String(),
          password: t.String(),
        }),
        detail: {
            security: [{ bearer: [] }],
            tags: ["Subscription"],
          },
      })

  );
};
export default subscriptionRoutes as any;
