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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariationService = void 0;
const __1 = require("..");
const middlewares_1 = require("../middlewares");
class VariationService {
    createVariation(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { productId, type, value } = payload;
            const productExists = yield __1.prismaClient.product.findUnique({
                where: { id: productId },
            });
            if (!productExists) {
                throw new Error(`Product with ID ${productId} not found`);
            }
            const variation = yield __1.prismaClient.variation.create({
                data: {
                    productId,
                    type,
                    value,
                },
            });
            return {
                message: "Product variation created",
                data: variation,
            };
        });
    }
    updateVariation(variationId, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            let variation = yield __1.prismaClient.variation.findUnique({
                where: { id: variationId },
            });
            if (!variation) {
                throw new middlewares_1.ResourceNotFound(`Variation with ID ${variationId} not found`);
            }
            variation = yield __1.prismaClient.variation.update({
                where: { id: variationId },
                data: payload,
            });
            return {
                message: "Variation updated successfully",
                data: variation,
            };
        });
    }
    deleteVariation(variationId) {
        return __awaiter(this, void 0, void 0, function* () {
            let variation = yield __1.prismaClient.variation.findUnique({
                where: { id: variationId },
            });
            if (!variation) {
                throw new middlewares_1.ResourceNotFound(`Variation with ID ${variationId} not found`);
            }
            yield __1.prismaClient.variation.delete({
                where: { id: variationId },
            });
            return {
                message: "Variation deleted",
                data: variation,
            };
        });
    }
    getAllVariation(skip) {
        return __awaiter(this, void 0, void 0, function* () {
            const variation = yield __1.prismaClient.variation.findMany({
                skip: Number(skip) || 0,
                take: 10,
                include: {
                    product: true,
                },
            });
            if (!variation || variation.length == 0) {
                return {
                    message: "No variation listed yet",
                    data: variation,
                };
            }
            return {
                message: "variation info",
                data: variation,
            };
        });
    }
}
exports.VariationService = VariationService;
