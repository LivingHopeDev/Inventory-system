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
exports.searchProduct = exports.deleteProduct = exports.getAllProduct = exports.getProductById = exports.updateProduct = exports.createProduct = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const services_1 = require("../services");
const productService = new services_1.ProductService();
exports.createProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let files = [];
    if (Array.isArray(req.files)) {
        files = req.files;
    }
    else if (req.file) {
        files = [req.file];
    }
    const { message, data } = yield productService.createProduct(req.body, files);
    res.status(201).json({ message, data });
}));
exports.updateProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let files = [];
    if (Array.isArray(req.files)) {
        files = req.files;
    }
    else if (req.file) {
        files = [req.file];
    }
    const { message, data } = yield productService.updateProduct(req.body, req.params.id, files);
    res.status(200).json({ message, data });
}));
exports.getProductById = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, data } = yield productService.getProductById(req.params.id);
    res.status(200).json({ message, data });
}));
exports.getAllProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = req.query.skip;
    const { message, data } = yield productService.getAllProduct(skip);
    res.status(200).json({ message, data });
}));
exports.deleteProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message, data } = yield productService.deleteProduct(req.params.id);
    res.status(200).json({ message, data });
}));
exports.searchProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const skip = req.query.skip;
    const searchTerm = req.query.q;
    const { message, data } = yield productService.serchProduct(searchTerm, skip);
    res.status(200).json({ message, data });
}));
