import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stockQuantity: z.number(),
});

export const variationSchema = z.object({
    productId: z.string(),
    type: z.string(),
    value: z.string(),
});