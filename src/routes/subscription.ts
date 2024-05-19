import Elysia, { t } from "elysia";
import { getSubscription, addSubscription, editSubscription } from "../controllers/SubscriptionController";
import { auth } from "../middlewares/auth";

const subscriptionRoutes = (app: Elysia) => {
  app.group("/app/subscription", (app) =>
    app
      .get("", getSubscription, {
        beforeHandle: (c) => auth(c),
        detail: {
            security: [{ bearer: [] }],
            tags: ["Subscription"],
          },
      })
      
      .post("/add", addSubscription, {
        beforeHandle: (c) => auth(c),
        body: t.Object({
          name: t.String(),
          amount: t.Number(),
          tag: t.String(),
          status: t.String(),
        }),
        detail: {
            security: [{ bearer: [] }],
            tags: ["Subscription"],
          },
      })

      .put("/edit", editSubscription, {
        beforeHandle: (c) => auth(c),
        body: t.Object({
          id: t.Number(),
          name: t.String(),
          amount: t.Number(),
          tag: t.String(),
          status: t.String(),
        }),
        detail: {
            security: [{ bearer: [] }],
            tags: ["Subscription"],
          },
      })

  );
};
export default subscriptionRoutes as any;
