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
exports.getCart = exports.updateCartItem = exports.addToCart = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const services_1 = require("../services");
const cartService = new services_1.CartService();
exports.addToCart = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const id = req.user.id;
    const { message, data } = yield cartService.addToCart(payload, id);
    res.status(201).json({ message, data });
}));
exports.updateCartItem = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartItemId = req.params.id;
    const { quantity } = req.body;
    const id = req.user.id;
    if (!cartItemId || !quantity || isNaN(quantity)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid request data',
        });
    }
    const { message, data } = yield cartService.updateCartItemQuantity(cartItemId, quantity, id);
    res.status(200).json({
        success: true,
        message,
        data
    });
}));
exports.getCart = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { message, data } = yield cartService.getCart(userId);
    res.status(200).json({
        message,
        data,
    });
}));
