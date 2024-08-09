import { IProduct } from "../types";
import { Product } from "@prisma/client";
import { prismaClient } from "..";
import { ResourceNotFound } from "../middlewares";
export class ProductService {

    public async createProduct(payload: IProduct): Promise<{
        message: string;
        data: Partial<Product>;
    }> {

        const { name, description, price, stockQuantity } = payload
        const product = await prismaClient.product.create({
            data: {
                name,
                description,
                price,
                stockQuantity
            }
        })

        return {
            message: "Product created",
            data: product,
        }
    }
    public async updateProduct(payload: string, productId: string): Promise<{
        message: string;
        data: Partial<Product>
    }> {

        let product = await prismaClient.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`);
        }
        product = await prismaClient.product.update({
            where: { id: productId },
            data: payload
        })

        return {
            message: "Product updated",
            data: product,
        }
    }
    public async getProductById(productId: string): Promise<{
        message: string;
        data: Partial<Product>
    }> {

        const product = await prismaClient.product.findFirst({
            where: { id: productId }

        })
        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`)
        }
        return {
            message: "Product info",
            data: product
        }
    }

    public async getAllProduct(skip: string): Promise<{
        message: string;
        data: Partial<Product>[]
    }> {

        const product = await prismaClient.product.findMany({
            skip: Number(skip) || 0,
            take: 10,
            include: {
                variations: true
            },
        })
        if (!product || product.length == 0) {
            return {
                message: "No Product listed yet",
                data: product
            }
        }

        return {
            message: "Product info",
            data: product
        }
    }
    public async deleteProduct(productId: string): Promise<{
        message: string;
        data: Partial<Product>
    }> {
        const product = await prismaClient.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`);
        }
        await prismaClient.product.delete({
            where: { id: productId },
        })

        return {
            message: "Product deleted",
            data: product,
        }
    }
    public async serchProduct(query: string, skip: string): Promise<{
        message: string;
        data: Partial<Product>[]
    }> {
        const products = await prismaClient.product.findMany({
            where: {
                name: {
                    search: String(query),
                },
                description: {
                    search: String(query),
                },

            },
            skip: Number(skip) || 0,
            take: 10,
        });
        if (!products) {
            return {
                message: "No Product match",
                data: products,
            }
        }
        return {
            message: "Product search result",
            data: products,
        }
    }




}