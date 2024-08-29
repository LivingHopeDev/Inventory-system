import { productSchema, variationSchema } from "../schema";
import { validateData, authMiddleware, adminMiddleware } from "../middlewares";
import { createOrderFromCartItems, deleteOrder, getAllOrders, getOrderById, updateOrderStatus, cancelOrder } from "../controllers"
import { Router } from "express";

const orderRoute = Router();

orderRoute.post("/", [authMiddleware], createOrderFromCartItems);
orderRoute.get("/", [authMiddleware], getAllOrders);
orderRoute.get("/:id", [authMiddleware], getOrderById);
orderRoute.patch("/:id/cancel", [authMiddleware], cancelOrder);

orderRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteOrder);
orderRoute.patch("/:id/status", [authMiddleware, adminMiddleware], updateOrderStatus);


export { orderRoute };
