"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserSchema = exports.AddressSchema = exports.loginSchema = exports.SignUpSchema = void 0;
const zod_1 = require("zod");
exports.SignUpSchema = zod_1.z.object({
    first_name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters long"),
});
exports.AddressSchema = zod_1.z.object({
    lineOne: zod_1.z.string(),
    lineTwo: zod_1.z.string().optional(),
    pincode: zod_1.z.string().length(6),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
});
exports.UpdateUserSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    defaultShippingAddressId: zod_1.z.number().optional(),
    defaultBillingAddressId: zod_1.z.number().optional(),
});
