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
exports.deleteOrder = exports.updateOrderStatus = exports.cancelOrder = exports.updateOrder = exports.getOrderById = exports.getAllOrders = exports.createOrderFromCartItems = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const services_1 = require("../services");
const orderService = new services_1.OrderService();
exports.createOrderFromCartItems = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { cartItemIds, shippingAddress, billingAddress } = req.body;
    const { message, data } = yield orderService.createOrderFromCartItems(userId, cartItemIds, shippingAddress, billingAddress);
    res.status(201).json({ message, data });
}));
exports.getAllOrders = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const { message, data } = yield orderService.getAllOrders(userId);
    res.status(200).json({ message, data });
}));
exports.getOrderById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const userId = req.user.id;
    const { message, data } = yield orderService.getOrderById(orderId, userId);
    res.status(200).json({ message, data });
}));
exports.updateOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const payload = req.body;
    const userId = req.user.id;
    const { message, data } = yield orderService.updateOrder(orderId, userId, payload);
    res.status(200).json({ message, data });
}));
exports.cancelOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const userId = req.user.id;
    const { message, data } = yield orderService.cancelOrder(orderId, userId);
    res.status(200).json({ message, data });
}));
exports.updateOrderStatus = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { status } = req.body;
    const userId = req.user.id;
    const { message, data } = yield orderService.updateOrderStatus(orderId, status, userId);
    res.status(200).json({ message, data });
}));
exports.deleteOrder = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const orderId = req.params.id;
    const { message } = yield orderService.deleteOrder(orderId);
    res.status(200).json({ message });
}));
