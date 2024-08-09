import { Router } from "express";
import { authRoute } from "./auth";
import { productRoute } from "./product";
import { variationRoute } from "./variation"
// import userRoutes from "./user";
// import cartRoutes from "./cart";
// import orderRoute from "./order";
const rootRouter: Router = Router();
rootRouter.use("/auth", authRoute);
rootRouter.use("/products", productRoute);
rootRouter.use("/variations", variationRoute);

// rootRouter.use("/user", userRoutes);
// rootRouter.use("/cart", cartRoutes);
// rootRouter.use("/order", orderRoute);

export default rootRouter;
