import { PrismaClient, Order, OrderEventStatus } from "@prisma/client";
import { BadRequest, ResourceNotFound, Unauthorised } from "../middlewares";
import io from "../index";

const prismaClient = new PrismaClient();

export class OrderService {
  public async createOrderFromCartItems(
    userId: string,
    cartItemIds: string[],
    shippingAddress: string,
    billingAddress: string
  ): Promise<{ message: string; data: Partial<Order> }> {
    const cartItems = await prismaClient.cartItem.findMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
      include: { product: true, variation: true },
    });

    if (!cartItems.length) {
      throw new ResourceNotFound("No valid cart items selected");
    }

    const netAmount = cartItems.reduce((total, item) => {
      return total + Number(item.product.price) * item.quantity;
    }, 0);

    const order = await prismaClient.order.create({
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
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });

    await prismaClient.cartItem.deleteMany({
      where: {
        id: { in: cartItemIds },
        userId,
      },
    });

    return {
      message: "Order created successfully",
      data: order,
    };
  }

  public async getAllOrders(
    userId: string
  ): Promise<{ message: string; data: Partial<Order>[] }> {
    const orders = await prismaClient.order.findMany({
      where: { userId },
      include: { orderProducts: true, events: true },
    });

    if (!orders.length) {
      throw new ResourceNotFound("No orders found for this user.");
    }

    return {
      message: "Orders retrieved successfully",
      data: orders,
    };
  }

  public async getOrderById(
    orderId: string,
    userId: string
  ): Promise<{ message: string; data: Partial<Order> }> {
    const order = await prismaClient.order.findFirst({
      where: { id: orderId, userId },
      include: { orderProducts: true, events: true },
    });

    if (!order) {
      throw new ResourceNotFound(`Order with ID ${orderId} not found`);
    }

    return {
      message: "Order retrieved successfully",
      data: order,
    };
  }

  public async updateOrder(
    orderId: string,
    userId: string,
    payload: Partial<Order>
  ): Promise<{ message: string; data: Partial<Order> }> {
    const order = await prismaClient.order.findFirst({
      where: { id: orderId, userId },
    });

    if (!order) {
      throw new ResourceNotFound(`Order with ID ${orderId} not found`);
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: orderId },
      data: payload,
      include: { orderProducts: true, events: true },
    });

    return {
      message: "Order updated successfully",
      data: updatedOrder,
    };
  }
  public async cancelOrder(
    orderId: string,
    userId: string
  ): Promise<{ message: string; data: Partial<Order> }> {
    const order = await prismaClient.order.findFirst({
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
      throw new ResourceNotFound(
        `Order with ID ${orderId} not found or out for delivery`
      );
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
      },
      include: {
        orderProducts: true,
      },
    });

    const latestEvent = await prismaClient.orderEvent.findFirst({
      where: {
        orderId: updatedOrder.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (latestEvent) {
      await prismaClient.orderEvent.update({
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
  }
  public async updateOrderStatus(
    orderId: string,
    newStatus: OrderEventStatus,
    userId: string
  ): Promise<{ message: string; data: Partial<Order> }> {
    if (!Object.values(OrderEventStatus).includes(newStatus)) {
      throw new BadRequest(`Invalid order status: ${newStatus}`);
    }
    const user = await prismaClient.user.findFirst({ where: { id: userId } });
    if (!user) {
      throw new ResourceNotFound("User not found.");
    }

    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: { orderProducts: true, events: true },
    });
    if (!order) {
      throw new ResourceNotFound(`Order with ID ${orderId} not found`);
    }

    const updatedOrder = await prismaClient.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: { orderProducts: true },
    });

    // Update the order event
    const latestEvent = await prismaClient.orderEvent.findFirst({
      where: { orderId: updatedOrder.id },
      orderBy: { createdAt: "desc" },
    });
    if (latestEvent) {
      await prismaClient.orderEvent.update({
        where: { id: latestEvent.id },
        data: { status: newStatus },
      });
    }

    // Reduce stock if the order is delivered
    if (newStatus === OrderEventStatus.DELIVERED) {
      await this.reduceStock(orderId);
    }

    return {
      message: `Order status updated to ${newStatus}`,
      data: updatedOrder,
    };
  }
  public async reduceStock(orderId: string) {
    const order = await prismaClient.order.findUnique({
      where: { id: orderId },
      include: {
        orderProducts: true,
      },
    });

    if (!order) {
      throw new ResourceNotFound(`Order with ID ${orderId} not found`);
    }

    await Promise.all(
      order.orderProducts.map(async (orderProduct) => {
        const product = await prismaClient.product.update({
          where: { id: orderProduct.productId },
          data: { stockQuantity: { decrement: orderProduct.quantity } },
        });

        const stockNotification =
          await prismaClient.stockNotification.findFirst({
            where: { productId: product.id, isNotified: false },
          });

        if (
          stockNotification &&
          product.stockQuantity <= stockNotification.threshold
        ) {
          io.emit("lowStockNotification", {
            productId: product.id,
            productName: product.name,
            remainingStock: product.stockQuantity,
          });
          await prismaClient.stockNotification.update({
            where: { id: stockNotification.id },
            data: { isNotified: true },
          });
        }
      })
    );
  }

  public async deleteOrder(orderId: string): Promise<{ message: string }> {
    const order = await prismaClient.order.findFirst({
      where: { id: orderId },
    });

    if (!order) {
      throw new ResourceNotFound(`Order with ID ${orderId} not found`);
    }

    await prismaClient.order.delete({
      where: { id: orderId },
    });

    return {
      message: "Order and its related data deleted successfully",
    };
  }
}
