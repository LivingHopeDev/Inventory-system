import { productSchema, variationSchema } from "../schema";
import { validateData, authMiddleware, adminMiddleware } from "../middlewares";
import { createProduct, updateProduct, getProductById, getAllProduct, searchProduct, deleteProduct } from "../controllers"
import { Router } from "express";

const productRoute = Router();

productRoute.post("/", validateData(productSchema), [authMiddleware, adminMiddleware], createProduct);
productRoute.get("/", getAllProduct);
productRoute.get("/search", searchProduct);
productRoute.get("/:id", getProductById);
productRoute.patch("/:id", validateData(productSchema), [authMiddleware, adminMiddleware], updateProduct);
productRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteProduct);



export { productRoute };
