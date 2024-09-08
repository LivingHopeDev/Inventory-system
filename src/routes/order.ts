import { productSchema, variationSchema } from "../schema";
import { validateData, authMiddleware, adminMiddleware } from "../middlewares";
import { createOrderFromCartItems, deleteOrder, getAllOrders, getOrderById, updateOrderStatus, cancelOrder } from "../controllers"
import { Router } from "express";

const orderRoute = Router();

orderRoute.post("/", [authMiddleware], createOrderFromCartItems);
orderRoute.get("/", [authMiddleware], getAllOrders);
orderRoute.get("/:id", [authMiddleware], getOrderById);
orderRoute.patch("/:id/status", [authMiddleware, adminMiddleware], updateOrderStatus);
orderRoute.patch("/:id/cancel", [authMiddleware], cancelOrder);

orderRoute.delete("/:id", [authMiddleware, adminMiddleware], deleteOrder);


export { orderRoute };

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Create an order from cart items
 *     description: Creates an order from the selected cart items for the authenticated user. Requires authorization.
 *     tags: [Orders]
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
 *               cartItemIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of cart item IDs to create the order from.
 *                 example: ["cartItemId1", "cartItemId2"]
 *               shippingAddress:
 *                 type: string
 *                 description: Shipping address for the order.
 *                 example: "123 Shipping St, City, Country"
 *               billingAddress:
 *                 type: string
 *                 description: Billing address for the order.
 *                 example: "456 Billing Rd, City, Country"
 *     responses:
 *       201:
 *         description: Order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "order123"
 *                     userId:
 *                       type: string
 *                       example: "user123"
 *                     netAmount:
 *                       type: number
 *                       example: 100.50
 *                     shippingAddress:
 *                       type: string
 *                       example: "123 Shipping St, City, Country"
 *                     billingAddress:
 *                       type: string
 *                       example: "456 Billing Rd, City, Country"
 *                     orderProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "product123"
 *                           variationId:
 *                             type: string
 *                             example: "variation123"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       400:
 *         description: Bad Request - Invalid input data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid request data"
 *       404:
 *         description: No valid cart items selected.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No valid cart items selected"
 *       500:
 *         description: Internal Server Error - An unexpected error occurred.
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
 * /api/v1/orders:
 *   get:
 *     summary: Retrieve all orders for the authenticated user
 *     description: Fetches all orders for the authenticated user. Requires authorization.
 *     tags: [Orders]
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
 *     responses:
 *       200:
 *         description: Orders retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Orders retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "order123"
 *                       userId:
 *                         type: string
 *                         example: "user123"
 *                       netAmount:
 *                         type: number
 *                         example: 150.50
 *                       shippingAddress:
 *                         type: string
 *                         example: "123 Shipping St, City, Country"
 *                       billingAddress:
 *                         type: string
 *                         example: "456 Billing Rd, City, Country"
 *                       orderProducts:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             productId:
 *                               type: string
 *                               example: "product123"
 *                             variationId:
 *                               type: string
 *                               example: "variation123"
 *                             quantity:
 *                               type: integer
 *                               example: 2
 *                       events:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             eventId:
 *                               type: string
 *                               example: "event123"
 *                             eventType:
 *                               type: string
 *                               example: "ORDER_PLACED"
 *                             timestamp:
 *                               type: string
 *                               example: "2024-01-01T12:00:00Z"
 *       404:
 *         description: No orders found for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No orders found for this user."
 *       500:
 *         description: Internal Server Error - An unexpected error occurred.
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
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get a specific order by ID
 *     description: Retrieves a specific order by its ID for the authenticated user. Requires authorization.
 *     tags: [Orders]
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
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to retrieve.
 *         schema:
 *           type: string
 *           example: "order123"
 *     responses:
 *       200:
 *         description: Order retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "order123"
 *                     userId:
 *                       type: string
 *                       example: "user123"
 *                     netAmount:
 *                       type: number
 *                       example: 150.50
 *                     shippingAddress:
 *                       type: string
 *                       example: "123 Shipping St, City, Country"
 *                     billingAddress:
 *                       type: string
 *                       example: "456 Billing Rd, City, Country"
 *                     orderProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "product123"
 *                           variationId:
 *                             type: string
 *                             example: "variation123"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           eventId:
 *                             type: string
 *                             example: "event123"
 *                           eventType:
 *                             type: string
 *                             example: "ORDER_PLACED"
 *                           timestamp:
 *                             type: string
 *                             example: "2024-01-01T12:00:00Z"
 *       404:
 *         description: Order with the given ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order with ID order123 not found."
 *       500:
 *         description: Internal Server Error - An unexpected error occurred.
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
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update the status of a specific order
 *     description: Updates the status of an order based on the provided order ID. This action can only be performed by an admin. Requires both user authentication and admin privileges.
 *     tags: [Orders]
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
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update.
 *         schema:
 *           type: string
 *           example: "order123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status of the order.
 *                 example: "shipped"
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "order123"
 *                     userId:
 *                       type: string
 *                       example: "user123"
 *                     status:
 *                       type: string
 *                       example: "shipped"
 *                     orderProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "product123"
 *                           variationId:
 *                             type: string
 *                             example: "variation123"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *                     events:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           eventId:
 *                             type: string
 *                             example: "event123"
 *                           eventType:
 *                             type: string
 *                             example: "ORDER_UPDATED"
 *                           timestamp:
 *                             type: string
 *                             example: "2024-01-01T12:00:00Z"
 *       404:
 *         description: Order with the given ID not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order with ID order123 not found."
 *       403:
 *         description: Forbidden - Only admin users can update the order status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Admin privileges are required to update the order status."
 *       500:
 *         description: Internal Server Error - An unexpected error occurred.
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
 * /api/v1/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel a specific order
 *     description: Allows the user to cancel an order if its status is either "PENDING" or "ACCEPTED". The order cannot be canceled if it's already out for delivery or in another state.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for user authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to cancel.
 *         schema:
 *           type: string
 *           example: "order123"
 *     responses:
 *       200:
 *         description: Order canceled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order cancelled successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "order123"
 *                     userId:
 *                       type: string
 *                       example: "user123"
 *                     status:
 *                       type: string
 *                       example: "CANCELLED"
 *                     orderProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "product123"
 *                           variationId:
 *                             type: string
 *                             example: "variation123"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       404:
 *         description: Order not found or is no longer cancellable (e.g., out for delivery).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order with ID order123 not found or out for delivery."
 *       500:
 *         description: Internal Server Error - An unexpected error occurred.
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
 * /api/v1/orders/{id}/status:
 *   patch:
 *     summary: Update the status of an order
 *     description: Allows an admin to update the status of a specific order based on the provided order ID. The status can be updated to various states such as "PENDING", "ACCEPTED", "SHIPPED", or "DELIVERED". Additionally, the stock will be reduced if the order is marked as "DELIVERED".
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         description: Bearer token for admin authentication
 *         required: true
 *         schema:
 *           type: string
 *           example: Bearer <your-token>
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the order to update.
 *         schema:
 *           type: string
 *           example: "order123"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: The new status to set for the order. Valid values include "PENDING", "ACCEPTED", "SHIPPED", or "DELIVERED".
 *                 example: "DELIVERED"
 *     responses:
 *       200:
 *         description: Order status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order status updated to DELIVERED"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "order123"
 *                     status:
 *                       type: string
 *                       example: "DELIVERED"
 *                     orderProducts:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                             example: "product123"
 *                           variationId:
 *                             type: string
 *                             example: "variation123"
 *                           quantity:
 *                             type: integer
 *                             example: 2
 *       400:
 *         description: Invalid status value or bad request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid order status: INVALID_STATUS"
 *       404:
 *         description: Order or user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Order with ID order123 not found"
 *       500:
 *         description: Internal Server Error - An unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
