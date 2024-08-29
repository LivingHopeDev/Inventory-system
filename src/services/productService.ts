import { IProduct } from "../types";
import { Product, Prisma } from "@prisma/client";
import { prismaClient } from "..";
import { ResourceNotFound } from "../middlewares";
import { cloudinary } from "../utils/cloudinary";
import { getPublicIdFromUrl } from "../utils/getPublicId"
import log from "../utils/logger";
import fs from "fs"
export class ProductService {
    public async createProduct(payload: IProduct, imageFiles: Express.Multer.File[]): Promise<{
        message: string;
        data: Partial<Product>;
    }> {
        const { name, description, price, stockQuantity } = payload;

        const uploadResults = await Promise.all(imageFiles.map(async (file) => {
            console.log(`Uploading file: ${file.path}`);

            const result = await cloudinary.uploader.upload(file.path, {
                folder: "inventory/products",
            });
            fs.unlinkSync(file.path);

            return result;
        }));

        const imageUrls = uploadResults.map((result) => result.secure_url);

        const product = await prismaClient.product.create({
            data: {
                name,
                description,
                price: new Prisma.Decimal(price),
                stockQuantity: parseInt(stockQuantity),
                imageUrls,
            },
        });

        return {
            message: "Product created",
            data: product,
        };
    }
    public async updateProduct(
        payload: Partial<IProduct>,
        productId: string,
        imageFiles?: Express.Multer.File[]
    ): Promise<{
        message: string;
        data: Partial<Product>;
    }> {
        const { name, description, price, stockQuantity } = payload;

        let product = await prismaClient.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`);
        }

        let updatedImageUrls = product.imageUrls || [];

        if (imageFiles && imageFiles.length > 0) {
            if (product.imageUrls && product.imageUrls.length > 0) {

                for (const imageUrl of product.imageUrls) {
                    const publicId = getPublicIdFromUrl(imageUrl);
                    if (publicId) {
                        await cloudinary.uploader.destroy(`inventory/products/${publicId}`);
                    }
                }

                updatedImageUrls = [];
            }

            for (const imageFile of imageFiles) {
                const uploadResult = await cloudinary.uploader.upload(imageFile.path, {
                    folder: "inventory/products",
                });
                updatedImageUrls.push(uploadResult.secure_url);
                fs.unlinkSync(imageFile.path);

            }

        }

        product = await prismaClient.product.update({
            where: { id: productId },
            data: {
                name,
                description,
                price: price,
                stockQuantity: parseInt(stockQuantity),
                imageUrls: updatedImageUrls,
            },
        });

        return {
            message: "Product updated",
            data: product,
        };
    }

    public async getProductById(productId: string): Promise<{
        message: string;
        data: Partial<Product>;
    }> {

        const product = await prismaClient.product.findFirst({
            where: { id: productId },
        });

        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`);
        }

        return {
            message: "Product info",
            data: product,
        };
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
        data: Partial<Product>;
    }> {
        const product = await prismaClient.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            throw new ResourceNotFound(`Product with ID ${productId} not found`);
        }

        if (product.imageUrls && product.imageUrls.length > 0) {
            for (const imageUrl of product.imageUrls) {
                const publicId = getPublicIdFromUrl(imageUrl);
                if (publicId) {
                    await cloudinary.uploader.destroy(`inventory/products/${publicId}`);
                }
            }
        }

        await prismaClient.product.delete({
            where: { id: productId },
        });

        return {
            message: "Product deleted",
            data: product,
        };
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