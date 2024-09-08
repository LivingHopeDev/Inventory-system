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
exports.getAllVariation = exports.deleteVariation = exports.updateVariation = exports.createVariation = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const services_1 = require("../services");
const variationService = new services_1.VariationService();
exports.createVariation = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, data } = yield variationService.createVariation(req.body);
    res.status(201).json({ message, data });
}));
exports.updateVariation = (0, asyncHandler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const variationId = req.params.id;
    const payload = req.body;
    const { message, data } = yield variationService.updateVariation(variationId, payload);
    res.status(200).json({ message, data });
}));
exports.deleteVariation = ((0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { message, data } = yield variationService.deleteVariation(id);
    res.status(200).send({ message, data });
})));
exports.getAllVariation = ((0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = req.query.skip;
    const { message, data } = yield variationService.getAllVariation(skip);
    res.status(200).send({ message, data });
})));
