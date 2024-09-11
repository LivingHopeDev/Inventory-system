import { productSchema, variationSchema } from "../schema";
import { validateData, authMiddleware, adminMiddleware } from "../middlewares";
import { createProduct, updateProduct, getProductById, getAllProduct, searchProduct, deleteProduct } from "../controllers"
import { Router } from "express";
import { uploadFiles } from "../utils/multer";

const productRoute = Router();

productRoute.post(
  "/",
  uploadFiles,
  validateData(productSchema),
  [authMiddleware],
  createProduct
);
productRoute.get("/", getAllProduct);
productRoute.get("/search", searchProduct);
productRoute.get("/:id", getProductById);
productRoute.patch(
  "/:id",
  uploadFiles,
  validateData(productSchema),
  [authMiddleware],
  updateProduct
);
productRoute.delete("/:id", [authMiddleware], deleteProduct);

// productRoute.post("/", uploadFiles, validateData(productSchema), [authMiddleware, adminMiddleware], createProduct);
// productRoute.get("/", getAllProduct);
// productRoute.get("/search", searchProduct);
// productRoute.get("/:id", getProductById);
// productRoute.patch("/:id", uploadFiles, validateData(productSchema), [authMiddleware, adminMiddleware], updateProduct);
// productRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteProduct);



export { productRoute };

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with the given details and returns the created product's information. Requires authorization.
 *     tags: [Products]
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
 *               name:
 *                 type: string
 *                 description: The name of the product.
 *               description:
 *                 type: string
 *                 description: A detailed description of the product.
 *               price:
 *                 type: number
 *                 description: The price of the product.
 *                 example: 29.99
 *               stockQuantity:
 *                 type: integer
 *                 description: The available stock quantity of the product.
 *                 example: 100
 *               threshold:
 *                 type: integer
 *                 description: The lowest quantity of the product for the notification to be triggered .
 *                 example: 10
 *             example:
 *               name: "New Product"
 *               description: "This is a description of the new product."
 *               price: 29.99
 *               stockQuantity: 100
 *               threshold: 10
 *     responses:
 *       201:
 *         description: Product created successfully. Returns the product details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product created"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "New Product"
 *                     description:
 *                       type: string
 *                       example: "This is a description of the new product."
 *                     price:
 *                       type: number
 *                       example: 29.99
 *                     stockQuantity:
 *                       type: integer
 *                       example: 100
 *                     threshold:
 *                       type: integer
 *                       example: 10
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
 *       500:
 *         description: Internal Server Error - An unexpected error occurred while creating the product.
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
 * /products/{id}:
 *   patch:
 *     summary: Update an existing product
 *     description: Updates the details of an existing product identified by the product ID. Requires authorization.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to be updated.
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
 *               name:
 *                 type: string
 *                 description: The new name of the product.
 *               description:
 *                 type: string
 *                 description: The new description of the product.
 *               price:
 *                 type: number
 *                 description: The new price of the product.
 *                 example: 19.99
 *               stockQuantity:
 *                 type: integer
 *                 description: The new stock quantity of the product.
 *                 example: 150
 *             example:
 *               name: "Updated Product Name"
 *               description: "This is an updated description of the product."
 *               price: 19.99
 *               stockQuantity: 150
 *     responses:
 *       200:
 *         description: Product updated successfully. Returns the updated product details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product updated"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Updated Product Name"
 *                     description:
 *                       type: string
 *                       example: "This is an updated description of the product."
 *                     price:
 *                       type: number
 *                       example: 19.99
 *                     stockQuantity:
 *                       type: integer
 *                       example: 150
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID abc123 not found"
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
 *       500:
 *         description: Internal Server Error - An unexpected error occurred while updating the product.
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
 * /products/{id}:
 *   get:
 *     summary: Get product details by ID
 *     description: Retrieves the details of a specific product identified by the product ID. Requires authorization.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to retrieve.
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *     responses:
 *       200:
 *         description: Product details successfully retrieved.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product info"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Product Name"
 *                     description:
 *                       type: string
 *                       example: "Description of the product."
 *                     price:
 *                       type: number
 *                       example: 19.99
 *                     stockQuantity:
 *                       type: integer
 *                       example: 150
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID abc123 not found"
 *                 status_code:
 *                   type: integer
 *                   example: 404
 */



/**
 * @swagger
 * /products:
 *   get:
 *     summary: Retrieve all products
 *     description: Retrieves a list of all products, with optional pagination.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: string
 *         description: Number of products to skip (for pagination). Defaults to 0.
 *     responses:
 *       200:
 *         description: Successfully retrieved list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product info"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc123"
 *                       name:
 *                         type: string
 *                         example: "Product Name"
 *                       description:
 *                         type: string
 *                         example: "Description of the product."
 *                       price:
 *                         type: number
 *                         example: 19.99
 *                       stockQuantity:
 *                         type: integer
 *                         example: 150
 *                       variations:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               example: "var123"
 *                             name:
 *                               type: string
 *                               example: "Variation Name"
 *                             price:
 *                               type: number
 *                               example: 5.99
 *       404:
 *         description: No products found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Product listed yet"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 * */


/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Deletes a product by its ID. Requires authorization.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to delete.
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *     responses:
 *       200:
 *         description: Product successfully deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "abc123"
 *                     name:
 *                       type: string
 *                       example: "Product Name"
 *                     description:
 *                       type: string
 *                       example: "Description of the product."
 *                     price:
 *                       type: number
 *                       example: 19.99
 *                     stockQuantity:
 *                       type: integer
 *                       example: 150
 *       404:
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product with ID {id} not found"
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search for products
 *     description: Searches for products by name or description using a query string and returns a paginated list of results.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search term to use for querying product names and descriptions.
 *       - in: query
 *         name: skip
 *         schema:
 *           type: string
 *           default: "0"
 *         description: The number of items to skip for pagination.
 *     responses:
 *       200:
 *         description: Products successfully retrieved based on search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product search result"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "abc123"
 *                       name:
 *                         type: string
 *                         example: "Product Name"
 *                       description:
 *                         type: string
 *                         example: "Description of the product."
 *                       price:
 *                         type: number
 *                         example: 19.99
 *                       stockQuantity:
 *                         type: integer
 *                         example: 150
 *       404:
 *         description: No products found matching the search criteria.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No Product match"
 * */

