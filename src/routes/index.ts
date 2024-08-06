import { Router } from "express";
import { authRoute } from "./auth";
import { productRoute } from "./product";
// import userRoutes from "./user";
// import cartRoutes from "./cart";
// import orderRoute from "./order";
const rootRouter: Router = Router();
rootRouter.use("/auth", authRoute);
rootRouter.use("/products", productRoute);
// rootRouter.use("/user", userRoutes);
// rootRouter.use("/cart", cartRoutes);
// rootRouter.use("/order", orderRoute);

export default rootRouter;
