import { validateData, authMiddleware } from "../middlewares";
import { Router } from "express";
import { CreateCartSchema } from "../schema";
import { addToCart, getCart, updateCartItem } from "../controllers";

const cartRoute = Router();

cartRoute.post("/", validateData(CreateCartSchema), authMiddleware, addToCart);
cartRoute.get("/", authMiddleware, getCart);
cartRoute.patch("/:id", authMiddleware, updateCartItem);
// cartRoute.get("/search", searchProduct);
// cartRoute.get("/:id", getProductById);
// cartRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteProduct);



export { cartRoute };



/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the user's cart
 *     description: Adds a product with a specific variation to the user's cart. If the item already exists in the cart, the quantity will be updated.
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
 *                 description: The unique identifier of the product to be added.
 *                 example: "5f8d0d55b54764421b7156e0"
 *               quantity:
 *                 type: integer
 *                 description: The number of items to add to the cart.
 *                 example: 2
 *               variationId:
 *                 type: string
 *                 description: The unique identifier of the product variation.
 *                 example: "7b8c9d10e11f1213141516a1"
 *             example:
 *               productId: "5f8d0d55b54764421b7156e0"
 *               quantity: 2
 *               variationId: "7b8c9d10e11f1213141516a1"
 *     responses:
 *       201:
 *         description: Item added to cart successfully. Returns the updated cart item details.
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
 *                       example: "123abc456def"
 *                     productId:
 *                       type: string
 *                       example: "5f8d0d55b54764421b7156e0"
 *                     variationId:
 *                       type: string
 *                       example: "7b8c9d10e11f1213141516a1"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input data"
 *       404:
 *         description: Product or variation not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID 5f8d0d55b54764421b7156e0 not found"
 *       500:
 *         description: Internal Server Error - An unexpected error occurred while adding the item to the cart.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */

/**
 * @swagger
 * /cart/{id}:
 *   patch:
 *     summary: Update the quantity of an item in the user's cart
 *     description: Updates the quantity of a specific item in the user's cart. If the new quantity is less than or equal to zero, the item will be removed from the cart.
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cart item to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: The quantity to add or subtract from the current cart item quantity. Positive values increase the quantity, and negative values decrease it.
 *                 example: 1
 *             example:
 *               quantity: 1
 *     responses:
 *       200:
 *         description: Cart updated successfully. Returns the updated cart item details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Cart updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "123abc456def"
 *                     productId:
 *                       type: string
 *                       example: "5f8d0d55b54764421b7156e0"
 *                     variationId:
 *                       type: string
 *                       example: "7b8c9d10e11f1213141516a1"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       404:
 *         description: Cart item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Cart item with ID 123abc456def not found"
 *       500:
 *         description: Internal Server Error - An unexpected error occurred while updating the cart item.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Retrieve the user's cart items
 *     description: Fetches all items in the user's cart, including product and variation details.
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart items retrieved successfully. Returns the list of cart items.
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
 *                         example: "123abc456def"
 *                       productId:
 *                         type: string
 *                         example: "5f8d0d55b54764421b7156e0"
 *                       product:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Sample Product"
 *                           description:
 *                             type: string
 *                             example: "A description of the product."
 *                           price:
 *                             type: number
 *                             example: 29.99
 *                       variationId:
 *                         type: string
 *                         example: "7b8c9d10e11f1213141516a1"
 *                       variation:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                             example: "Red - Large"
 *                           additionalPrice:
 *                             type: number
 *                             example: 5.00
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *       404:
 *         description: No items found in the cart.
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
 *                   items: {}
 *       500:
 *         description: Internal Server Error - An unexpected error occurred while retrieving the cart items.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
