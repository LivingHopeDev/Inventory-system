import { Variation } from '@prisma/client';
import { IVariation } from '../types';
import { prismaClient } from "..";
import { ResourceNotFound } from "../middlewares";



export class VariationService {
    public async createVariation(payload: IVariation): Promise<{
        message: string;
        data: Partial<Variation>;
    }> {

        const { productId, type, value } = payload;

        const productExists = await prismaClient.product.findUnique({
            where: { id: productId },
        });

        if (!productExists) {
            throw new Error(`Product with ID ${productId} not found`);
        }

        const variation = await prismaClient.variation.create({
            data: {
                productId,
                type,
                value,
            }
        });

        return {
            message: "Product variation created",
            data: variation,
        };
    }

    public async updateVariation(variationId: string, payload: Partial<Variation>): Promise<{
        message: string;
        data: Partial<Variation>;
    }> {

        let variation = await prismaClient.variation.findUnique({
            where: { id: variationId }
        })
        if (!variation) {
            throw new ResourceNotFound(`Variation with ID ${variationId} not found`)

        }
        variation = await prismaClient.variation.update({
            where: { id: variationId },
            data: payload,
        });

        return {
            message: "Variation updated successfully",
            data: variation,
        };
    }
    public async deleteVariation(variationId: string): Promise<{
        message: string;
        data: Partial<Variation>
    }> {

        let variation = await prismaClient.variation.findUnique({
            where: { id: variationId }
        })
        if (!variation) {
            throw new ResourceNotFound(`Variation with ID ${variationId} not found`)

        }
        await prismaClient.variation.delete({
            where: { id: variationId }
        })

        return {
            message: "Variation deleted",
            data: variation
        }
    }
    public async getAllVariation(skip: string): Promise<{
        message: string;
        data: Partial<Variation>[]
    }> {
        const variation = await prismaClient.variation.findMany({
            skip: Number(skip) || 0,
            take: 10,
            include: {
                product: true
            },
        })
        if (!variation || variation.length == 0) {
            return {
                message: "No variation listed yet",
                data: variation
            }
        }

        return {
            message: "variation info",
            data: variation
        }
    }
}


