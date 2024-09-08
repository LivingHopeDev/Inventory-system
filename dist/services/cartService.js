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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const __1 = require("..");
const middlewares_1 = require("../middlewares");
class CartService {
    addToCart(payload, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, quantity, variationId } = payload;
            let product = yield __1.prismaClient.product.findFirst({
                where: { id: productId },
            });
            if (!product) {
                throw new middlewares_1.ResourceNotFound(`Product with ID ${productId} not found`);
            }
            const variation = yield __1.prismaClient.variation.findFirst({
                where: { id: variationId },
            });
            if (!variation) {
                throw new middlewares_1.ResourceNotFound(`Variation with ID ${variationId} not found`);
            }
            let itemInCart;
            itemInCart = yield __1.prismaClient.cartItem.findFirst({
                where: {
                    productId,
                    userId,
                    variationId,
                },
            });
            if (itemInCart) {
                itemInCart.quantity += quantity;
                itemInCart = yield __1.prismaClient.cartItem.update({
                    where: {
                        id: itemInCart.id,
                    },
                    data: {
                        quantity: itemInCart.quantity,
                    },
                });
            }
            else {
                itemInCart = yield __1.prismaClient.cartItem.create({
                    data: {
                        userId,
                        productId,
                        variationId,
                        quantity: quantity,
                    },
                });
            }
            return {
                message: "Item added to cart",
                data: itemInCart,
            };
        });
    }
    updateCartItemQuantity(cartItemId, quantity, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItem = yield __1.prismaClient.cartItem.findFirst({
                where: {
                    id: cartItemId,
                    userId: userId,
                },
            });
            if (!cartItem) {
                throw new middlewares_1.ResourceNotFound(`Cart item with ID ${cartItemId} not found`);
            }
            const newQuantity = cartItem.quantity + quantity;
            if (newQuantity <= 0) {
                yield __1.prismaClient.cartItem.delete({
                    where: {
                        id: cartItemId,
                    },
                });
                return {
                    message: "Item removed from cart",
                    data: {},
                };
            }
            const updatedCartItem = yield __1.prismaClient.cartItem.update({
                where: {
                    id: cartItemId,
                },
                data: {
                    quantity: newQuantity,
                },
            });
            return {
                message: "Cart updated ",
                data: updatedCartItem,
            };
        });
    }
    getCart(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cartItems = yield __1.prismaClient.cartItem.findMany({
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
        });
    }
}
exports.CartService = CartService;
