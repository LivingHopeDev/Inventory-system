"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const client_1 = require("@prisma/client");
const middlewares_1 = require("../middlewares");
const index_1 = __importDefault(require("../index"));
const prismaClient = new client_1.PrismaClient();
class OrderService {
    createOrderFromCartItems(userId, cartItemIds, shippingAddress, billingAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItems = yield prismaClient.cartItem.findMany({
                where: {
                    id: { in: cartItemIds },
                    userId,
                },
                include: { product: true, variation: true },
            });
            if (!cartItems.length) {
                throw new middlewares_1.ResourceNotFound("No valid cart items selected");
            }
            const netAmount = cartItems.reduce((total, item) => {
                return total + Number(item.product.price) * item.quantity;
            }, 0);
            const order = yield prismaClient.order.create({
                data: {
                    userId,
                    netAmount,
                    shippingAddress,
                    billingAddress,
                    orderProducts: {
                        create: cartItems.map((item) => ({
                            productId: item.productId,
                            variationId: item.variationId,
                            quantity: item.quantity,
                        })),
                    },
                },
                include: {
                    orderProducts: true,
                },
            });
            yield prismaClient.orderEvent.create({
                data: {
                    orderId: order.id,
                },
            });
            yield prismaClient.cartItem.deleteMany({
                where: {
                    id: { in: cartItemIds },
                    userId,
                },
            });
            return {
                message: "Order created successfully",
                data: order,
            };
        });
    }
    getAllOrders(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield prismaClient.order.findMany({
                where: { userId },
                include: { orderProducts: true, events: true },
            });
            if (!orders.length) {
                throw new middlewares_1.ResourceNotFound("No orders found for this user.");
            }
            return {
                message: "Orders retrieved successfully",
                data: orders,
            };
        });
    }
    getOrderById(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prismaClient.order.findFirst({
                where: { id: orderId, userId },
                include: { orderProducts: true, events: true },
            });
            if (!order) {
                throw new middlewares_1.ResourceNotFound(`Order with ID ${orderId} not found`);
            }
            return {
                message: "Order retrieved successfully",
                data: order,
            };
        });
    }
    updateOrder(orderId, userId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prismaClient.order.findFirst({
                where: { id: orderId, userId },
            });
            if (!order) {
                throw new middlewares_1.ResourceNotFound(`Order with ID ${orderId} not found`);
            }
            const updatedOrder = yield prismaClient.order.update({
                where: { id: orderId },
                data: payload,
                include: { orderProducts: true, events: true },
            });
            return {
                message: "Order updated successfully",
                data: updatedOrder,
            };
        });
    }
    cancelOrder(orderId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prismaClient.order.findFirst({
                where: {
                    id: orderId,
                    userId,
                    status: {
                        in: ["PENDING", "ACCEPTED"],
                    },
                },
                include: {
                    orderProducts: true,
                },
            });
            if (!order) {
                throw new middlewares_1.ResourceNotFound(`Order with ID ${orderId} not found or out for delivery`);
            }
            const updatedOrder = yield prismaClient.order.update({
                where: { id: orderId },
                data: {
                    status: "CANCELLED",
                },
                include: {
                    orderProducts: true,
                },
            });
            const latestEvent = yield prismaClient.orderEvent.findFirst({
                where: {
                    orderId: updatedOrder.id,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            if (latestEvent) {
                yield prismaClient.orderEvent.update({
                    where: {
                        id: latestEvent.id,
                    },
                    data: {
                        status: "CANCELLED",
                    },
                });
            }
            return {
                message: "Order cancelled successfully",
                data: updatedOrder,
            };
        });
    }
    updateOrderStatus(orderId, newStatus, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(client_1.OrderEventStatus).includes(newStatus)) {
                throw new middlewares_1.BadRequest(`Invalid order status: ${newStatus}`);
            }
            const user = yield prismaClient.user.findFirst({ where: { id: userId } });
            if (!user) {
                throw new middlewares_1.ResourceNotFound("User not found.");
            }
            const order = yield prismaClient.order.findUnique({
                where: { id: orderId },
                include: { orderProducts: true, events: true },
            });
            if (!order) {
                throw new middlewares_1.ResourceNotFound(`Order with ID ${orderId} not found`);
            }
            const updatedOrder = yield prismaClient.order.update({
                where: { id: orderId },
                data: { status: newStatus },
                include: { orderProducts: true },
            });
            // Update the order event
            const latestEvent = yield prismaClient.orderEvent.findFirst({
                where: { orderId: updatedOrder.id },
                orderBy: { createdAt: "desc" },
            });
            if (latestEvent) {
                yield prismaClient.orderEvent.update({
                    where: { id: latestEvent.id },
                    data: { status: newStatus },
                });
            }
            // Reduce stock if the order is delivered
            if (newStatus === client_1.OrderEventStatus.DELIVERED) {
                yield this.reduceStock(orderId);
            }
            return {
                message: `Order status updated to ${newStatus}`,
                data: updatedOrder,
            };
        });
    }
    reduceStock(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prismaClient.order.findUnique({
                where: { id: orderId },
                include: {
                    orderProducts: true,
                },
            });
            if (!order) {
                throw new middlewares_1.ResourceNotFound(`Order with ID ${orderId} not found`);
            }
            yield Promise.all(order.orderProducts.map((orderProduct) => __awaiter(this, void 0, void 0, function* () {
                const product = yield prismaClient.product.update({
                    where: { id: orderProduct.productId },
                    data: { stockQuantity: { decrement: orderProduct.quantity } },
                });
                const stockNotification = yield prismaClient.stockNotification.findFirst({
                    where: { productId: product.id, isNotified: false },
                });
                if (stockNotification &&
                    product.stockQuantity <= stockNotification.threshold) {
                    index_1.default.emit("lowStockNotification", {
                        productId: product.id,
                        productName: product.name,
                        remainingStock: product.stockQuantity,
                    });
                    yield prismaClient.stockNotification.update({
                        where: { id: stockNotification.id },
                        data: { isNotified: true },
                    });
                }
            })));
        });
    }
    deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield prismaClient.order.findFirst({
                where: { id: orderId },
            });
            if (!order) {
                throw new middlewares_1.ResourceNotFound(`Order with ID ${orderId} not found`);
            }
            yield prismaClient.order.delete({
                where: { id: orderId },
            });
            return {
                message: "Order and its related data deleted successfully",
            };
        });
    }
}
exports.OrderService = OrderService;
