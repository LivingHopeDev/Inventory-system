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



/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user cart
 *     description: Retrieves all items currently in the user's cart, including product details and variations.
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart items successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cart items retrieved"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cartItem123"
 *                       productId:
 *                         type: string
 *                         example: "product123"
 *                       userId:
 *                         type: string
 *                         example: "user123"
 *                       variationId:
 *                         type: string
 *                         example: "variation456"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       product:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Product Name"
 *                           description:
 *                             type: string
 *                             example: "Product description here"
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 19.99
 *                       variation:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "Color"
 *                           value:
 *                             type: string
 *                             example: "Red"
 *       404:
 *         description: User's cart not found or empty.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Your cart is empty"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "cartItem123"
 *                       productId:
 *                         type: string
 *                         example: "product123"
 *                       userId:
 *                         type: string
 *                         example: "user123"
 *                       variationId:
 *                         type: string
 *                         example: "variation456"
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *                       product:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Product Name"
 *                           description:
 *                             type: string
 *                             example: "Product description here"
 *                           price:
 *                             type: number
 *                             format: float
 *                             example: 19.99
 *                       variation:
 *                         type: object
 *                         properties:
 *                           type:
 *                             type: string
 *                             example: "Color"
 *                           value:
 *                             type: string
 *                             example: "Red"
 * */


/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     description: Adds a product item to the user's cart. If the item already exists in the cart, its quantity is updated.
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add to the cart.
 *                 example: "product123"
 *               quantity:
 *                 type: integer
 *                 description: Quantity of the product to add to the cart.
 *                 example: 2
 *               variationId:
 *                 type: string
 *                 description: ID of the product variation to add to the cart.
 *                 example: "variation456"
 *     responses:
 *       201:
 *         description: Item successfully added to cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Item added to cart"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: ID of the cart item.
 *                       example: "cartItem123"
 *                     productId:
 *                       type: string
 *                       description: ID of the product.
 *                       example: "product123"
 *                     userId:
 *                       type: string
 *                       description: ID of the user who owns the cart.
 *                       example: "user123"
 *                     variationId:
 *                       type: string
 *                       description: ID of the product variation.
 *                       example: "variation456"
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product in the cart.
 *                       example: 2
 *       400:
 *         description: Invalid request data or missing product/variation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID product123 not found" or "Variation with ID variation456 not found"
 */
