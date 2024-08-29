import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { OrderService } from "../services";

const orderService = new OrderService();

export const createOrderFromCartItems = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { cartItemIds, shippingAddress, billingAddress } = req.body;

    const { message, data } = await orderService.createOrderFromCartItems(userId, cartItemIds, shippingAddress, billingAddress);
    res.status(201).json({ message, data });
});

export const getAllOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { message, data } = await orderService.getAllOrders(userId);
    res.status(200).json({ message, data });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const userId = req.user!.id;

    const { message, data } = await orderService.getOrderById(orderId, userId);
    res.status(200).json({ message, data });
});

export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const payload = req.body;
    const userId = req.user!.id;

    const { message, data } = await orderService.updateOrder(orderId, userId, payload);
    res.status(200).json({ message, data });
});

export const cancelOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const userId = req.user!.id;

    const { message, data } = await orderService.cancelOrder(orderId, userId);
    res.status(200).json({ message, data });
});
export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user!.id;

    const { message, data } = await orderService.updateOrderStatus(orderId, status, userId);

    res.status(200).json({ message, data });
});
export const deleteOrder = asyncHandler(async (req: Request, res: Response) => {
    const orderId = req.params.id;

    const { message } = await orderService.deleteOrder(orderId);
    res.status(200).json({ message });
});
