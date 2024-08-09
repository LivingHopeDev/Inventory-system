import { variationSchema } from "../schema";
import { validateData, authMiddleware, adminMiddleware } from "../middlewares";
import { getAllVariation, createVariation, deleteVariation, updateVariation } from "../controllers"
import { Router } from "express";

const variationRoute = Router();

variationRoute.get("/", getAllVariation);
variationRoute.post("/", validateData(variationSchema), [authMiddleware, adminMiddleware], createVariation);
variationRoute.patch("/:id", validateData(variationSchema), [authMiddleware, adminMiddleware], updateVariation);
variationRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteVariation);



export { variationRoute };
