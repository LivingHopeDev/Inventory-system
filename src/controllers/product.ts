import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler"
import { ProductService } from "../services";

const productService = new ProductService()
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    let files: Express.Multer.File[] = [];

    if (Array.isArray(req.files)) {
        files = req.files;
    } else if (req.file) {
        files = [req.file];
    }

    const { message, data } = await productService.createProduct(req.body, files);

    res.status(201).json({ message, data });
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    let files: Express.Multer.File[] = [];

    if (Array.isArray(req.files)) {
        files = req.files;
    } else if (req.file) {
        files = [req.file];
    }
    const { message, data } = await productService.updateProduct(req.body, req.params.id, files)

    res.status(200).json({ message, data })

})

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { message, data } = await productService.getProductById(req.params.id)

    res.status(200).json({ message, data })

})
export const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
    const skip = req.query.skip as string
    const { message, data } = await productService.getAllProduct(skip)

    res.status(200).json({ message, data })

})
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { message, data } = await productService.deleteProduct(req.params.id)

    res.status(200).json({ message, data })

})
export const searchProduct = asyncHandler(async (req: Request, res: Response) => {
    const skip = req.query.skip as string
    const searchTerm = req.query.q as string

    const { message, data } = await productService.serchProduct(searchTerm, skip)

    res.status(200).json({ message, data })

})

