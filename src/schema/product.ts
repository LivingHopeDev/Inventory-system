import { z } from "zod";

export const productSchema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stockQuantity: z.number(),
});
