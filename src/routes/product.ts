import { productSchema } from "../schema";
import { validateData, authMiddleware, adminMiddleware } from "../middlewares";
import { createProduct, updateProduct, getProductById, getAllProduct, searchProduct, deleteProduct } from "../controllers"
import { Router } from "express";

const productRoute = Router();

productRoute.post("/", validateData(productSchema), [authMiddleware, adminMiddleware], createProduct);
productRoute.get("/search", searchProduct);

productRoute.get("/", getAllProduct);
productRoute.get("/:id", getProductById);
productRoute.patch("/:id", validateData(productSchema), updateProduct);
productRoute.delete("/:id", deleteProduct);



export { productRoute };
