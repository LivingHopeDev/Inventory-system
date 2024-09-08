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
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
const __1 = require("..");
const middlewares_1 = require("../middlewares");
const cloudinary_1 = require("../utils/cloudinary");
const getPublicId_1 = require("../utils/getPublicId");
const fs_1 = __importDefault(require("fs"));
class ProductService {
    createProduct(payload, imageFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, stockQuantity, threshold } = payload;
            const uploadResults = yield Promise.all(imageFiles.map((file) => __awaiter(this, void 0, void 0, function* () {
                const result = yield cloudinary_1.cloudinary.uploader.upload(file.path, {
                    folder: "inventory/products",
                });
                fs_1.default.unlinkSync(file.path);
                return result;
            })));
            const imageUrls = uploadResults.map((result) => result.secure_url);
            const product = yield __1.prismaClient.product.create({
                data: {
                    name,
                    description,
                    price: new client_1.Prisma.Decimal(price),
                    stockQuantity: parseInt(stockQuantity),
                    imageUrls,
                },
            });
            yield __1.prismaClient.stockNotification.create({
                data: {
                    productId: product.id,
                    threshold: parseInt(threshold),
                },
            });
            return {
                message: "Product created",
                data: product,
            };
        });
    }
    updateProduct(payload, productId, imageFiles) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, description, price, stockQuantity, threshold } = payload;
            let product = yield __1.prismaClient.product.findUnique({
                where: { id: productId },
            });
            const stockNotification = yield __1.prismaClient.stockNotification.findFirst({
                where: { productId: productId },
            });
            if (!stockNotification) {
                throw new middlewares_1.ResourceNotFound(`Product notification not found`);
            }
            if (!product) {
                throw new middlewares_1.ResourceNotFound(`Product with ID ${productId} not found`);
            }
            let updatedImageUrls = product.imageUrls || [];
            if (imageFiles && imageFiles.length > 0) {
                if (product.imageUrls && product.imageUrls.length > 0) {
                    for (const imageUrl of product.imageUrls) {
                        const publicId = (0, getPublicId_1.getPublicIdFromUrl)(imageUrl);
                        if (publicId) {
                            yield cloudinary_1.cloudinary.uploader.destroy(`inventory/products/${publicId}`);
                        }
                    }
                    updatedImageUrls = [];
                }
                for (const imageFile of imageFiles) {
                    const uploadResult = yield cloudinary_1.cloudinary.uploader.upload(imageFile.path, {
                        folder: "inventory/products",
                    });
                    updatedImageUrls.push(uploadResult.secure_url);
                    fs_1.default.unlinkSync(imageFile.path);
                }
            }
            product = yield __1.prismaClient.product.update({
                where: { id: productId },
                data: {
                    name,
                    description,
                    price: price,
                    stockQuantity: parseInt(stockQuantity),
                    imageUrls: updatedImageUrls,
                },
            });
            yield __1.prismaClient.stockNotification.update({
                where: { id: stockNotification.id },
                data: {
                    threshold: parseInt(threshold),
                },
            });
            return {
                message: "Product updated",
                data: product,
            };
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield __1.prismaClient.product.findFirst({
                where: { id: productId },
            });
            if (!product) {
                throw new middlewares_1.ResourceNotFound(`Product with ID ${productId} not found`);
            }
            return {
                message: "Product info",
                data: product,
            };
        });
    }
    getAllProduct(skip) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield __1.prismaClient.product.findMany({
                skip: Number(skip) || 0,
                take: 10,
                include: {
                    variations: true,
                },
            });
            if (!product || product.length == 0) {
                return {
                    message: "No Product listed yet",
                    data: product,
                };
            }
            return {
                message: "Product info",
                data: product,
            };
        });
    }
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield __1.prismaClient.product.findUnique({
                where: { id: productId },
            });
            if (!product) {
                throw new middlewares_1.ResourceNotFound(`Product with ID ${productId} not found`);
            }
            if (product.imageUrls && product.imageUrls.length > 0) {
                for (const imageUrl of product.imageUrls) {
                    const publicId = (0, getPublicId_1.getPublicIdFromUrl)(imageUrl);
                    if (publicId) {
                        yield cloudinary_1.cloudinary.uploader.destroy(`inventory/products/${publicId}`);
                    }
                }
            }
            yield __1.prismaClient.product.delete({
                where: { id: productId },
            });
            return {
                message: "Product deleted",
                data: product,
            };
        });
    }
    serchProduct(query, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield __1.prismaClient.product.findMany({
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
                };
            }
            return {
                message: "Product search result",
                data: products,
            };
        });
    }
}
exports.ProductService = ProductService;
