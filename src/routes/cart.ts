import { validateData, authMiddleware } from "../middlewares";
import { Router } from "express";
import { CreateCartSchema } from "../schema";
import { addToCart, getCart, reduceCartItem } from "../controllers";

const cartRoute = Router();

cartRoute.post("/", validateData(CreateCartSchema), authMiddleware, addToCart);
cartRoute.get("/", authMiddleware, getCart);
cartRoute.patch("/:id", authMiddleware, reduceCartItem);
// cartRoute.get("/search", searchProduct);
// cartRoute.get("/:id", getProductById);
// cartRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteProduct);



export { cartRoute };
