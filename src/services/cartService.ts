import { CartItem } from "@prisma/client";
import { prismaClient } from "..";
import { ResourceNotFound, BadRequest } from "../middlewares";


export class CartService {

    public async addToCart(payload: Partial<CartItem>, userId: string): Promise<{ message: string, data: Partial<CartItem> }> {

        const { productId, quantity, variationId } = payload
        let product = await prismaClient.product.findFirst({ where: { id: productId } })

        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`)
        }
        const variation = await prismaClient.variation.findFirst({ where: { id: variationId! } })

        if (!variation) {
            throw new ResourceNotFound(`Variation with ID ${variationId} not found`)
        }
        let itemInCart;
        itemInCart = await prismaClient.cartItem.findFirst({
            where: {
                productId,
                userId,
                variationId,
            }
        })
        if (itemInCart) {
            itemInCart.quantity += quantity!
            itemInCart = await prismaClient.cartItem.update({
                where: {
                    id: itemInCart.id
                },
                data: {
                    quantity: itemInCart.quantity
                }
            })
        } else {
            itemInCart = await prismaClient.cartItem.create({
                data: {
                    userId,
                    productId,
                    variationId,
                    quantity: quantity!
                } as CartItem
            })
        }
        return {
            message: "Item added to cart",
            data: itemInCart
        }
    }

    public async updateCartItemQuantity(cartItemId: any, quantity: number, userId: string): Promise<{ message: string; data: Partial<CartItem> }> {
        const cartItem = await prismaClient.cartItem.findFirst({
            where: {
                id: cartItemId,
                userId: userId,
            },
        });

        if (!cartItem) {
            throw new ResourceNotFound(`Cart item with ID ${cartItemId} not found`);
        }

        const newQuantity = cartItem.quantity + quantity;

        if (newQuantity <= 0) {
            await prismaClient.cartItem.delete({
                where: {
                    id: cartItemId,
                },
            });
            return {
                message: 'Item removed from cart',
                data: {},
            };
        }

        const updatedCartItem = await prismaClient.cartItem.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity: newQuantity,
            },
        });

        return {
            message: 'Cart updated ',
            data: updatedCartItem,
        };
    }

    public async getCart(userId: string): Promise<{ message: string, data: Partial<CartItem[]> }> {
        const cartItems = await prismaClient.cartItem.findMany({
            where: { userId },
            include: {
                product: true,
                variation: true,
            },
        });

        if (cartItems.length === 0) {
            return {
                message: "Your cart is empty",
                data: [],
            };
        }

        return {
            message: "Cart items retrieved",
            data: cartItems,
        };
    }
}


