"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.variationSchema = exports.productSchema = void 0;
const zod_1 = require("zod");
exports.productSchema = zod_1.z.object({
    name: zod_1.z.string(),
    description: zod_1.z.string(),
    price: zod_1.z.string(),
    stockQuantity: zod_1.z.string(),
    threshold: zod_1.z.string()
});
exports.variationSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    type: zod_1.z.string(),
    value: zod_1.z.string(),
});
