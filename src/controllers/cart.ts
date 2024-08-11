import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { CartService } from "../services";
const cartService = new CartService()
export const addToCart = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body
    const id = req.user!.id

    const { message, data } = await cartService.addToCart(payload, id)
    res.status(201).json({ message, data })
})


export const updateCartItem = asyncHandler(
    async (req: Request, res: Response) => {
        const cartItemId = req.params.id;
        const { quantity } = req.body;
        const id = req.user!.id

        if (!cartItemId || !quantity || isNaN(quantity)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid request data',
            });
        }

        const { message, data } = await cartService.updateCartItemQuantity(cartItemId, quantity, id);

        res.status(200).json({
            success: true,
            message,
            data
        });
    }

);

export const getCart = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const { message, data } = await cartService.getCart(userId);

    res.status(200).json({
        message,
        data,
    });
});