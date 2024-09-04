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

/**
 * @swagger
 * /variations:
 *   post:
 *     summary: Create a new product variation
 *     description: Creates a new variation for a product, such as size or color, and associates it with the specified product. Requires authorization.
 *     tags: [Variations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to which the variation will be added.
 *                 example: "abc123"
 *               type:
 *                 type: string
 *                 description: The type of the variation (e.g., size, color).
 *                 example: "Size"
 *               value:
 *                 type: string
 *                 description: The value of the variation (e.g., S, M, L).
 *                 example: "Large"
 *     responses:
 *       201:
 *         description: Variation successfully created for the product.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product variation created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "var123"
 *                     productId:
 *                       type: string
 *                       example: "abc123"
 *                     type:
 *                       type: string
 *                       example: "Size"
 *                     value:
 *                       type: string
 *                       example: "Large"
 *       404:
 *         description: Product with the given ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID abc123 not found"
 */

/**
 * @swagger
 * /variations/{id}:
 *   patch:
 *     summary: Update an existing product variation
 *     description: Updates the details of an existing variation (such as type or value) for a product based on the provided variation ID. Requires authorization.
 *     tags: [Variations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the variation to be updated.
 *         schema:
 *           type: string
 *           example: "var123"
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the variation (e.g., size, color).
 *                 example: "Size"
 *               value:
 *                 type: string
 *                 description: The value of the variation (e.g., S, M, L).
 *                 example: "Large"
 *     responses:
 *       200:
 *         description: Variation successfully updated.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variation updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "var123"
 *                     productId:
 *                       type: string
 *                       example: "abc123"
 *                     type:
 *                       type: string
 *                       example: "Size"
 *                     value:
 *                       type: string
 *                       example: "Large"
 *       404:
 *         description: Variation with the given ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variation with ID var123 not found"
 */



/**
 * @swagger
 * /variations/{id}:
 *   delete:
 *     summary: Delete a product variation
 *     description: Deletes a specific product variation identified by the variation ID. Requires authorization.
 *     tags: [Variations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the variation to be deleted.
 *         schema:
 *           type: string
 *           example: "var123"
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *     responses:
 *       200:
 *         description: Variation successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variation deleted"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "var123"
 *                     productId:
 *                       type: string
 *                       example: "abc123"
 *                     type:
 *                       type: string
 *                       example: "Size"
 *                     value:
 *                       type: string
 *                       example: "Large"
 *       404:
 *         description: Variation with the given ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variation with ID var123 not found"
 */


/**
 * @swagger
 * /variations:
 *   get:
 *     summary: Get all product variations
 *     description: Retrieves a paginated list of all product variations.
 *     tags: [Variations]
 *     parameters:
 *       - name: skip
 *         in: query
 *         required: false
 *         description: Number of records to skip for pagination. Defaults to 0 if not provided.
 *         schema:
 *           type: string
 *           example: "0"
 *     responses:
 *       200:
 *         description: A list of product variations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Variation info"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "var123"
 *                       productId:
 *                         type: string
 *                         example: "abc123"
 *                       type:
 *                         type: string
 *                         example: "Size"
 *                       value:
 *                         type: string
 *                         example: "Large"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "abc123"
 *                           name:
 *                             type: string
 *                             example: "Product Name"
 *       404:
 *         description: No variations found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No variation listed yet"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "var123"
 *                       productId:
 *                         type: string
 *                         example: "abc123"
 *                       type:
 *                         type: string
 *                         example: "Size"
 *                       value:
 *                         type: string
 *                         example: "Large"
 *                       product:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             example: "abc123"
 *                           name:
 *                             type: string
 *                             example: "Product Name"
 * */
