import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler"
import { ProductService } from "../services";

const productService = new ProductService()
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const { message, product } = await productService.createProduct(req.body)
    res.status(201).json({ message, product })

})

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { message, product } = await productService.updateProduct(req.body, req.params.id)

    res.status(200).json({ message, product })

})

export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { message, product } = await productService.getProductById(req.params.id)

    res.status(200).json({ message, product })

})
export const getAllProduct = asyncHandler(async (req: Request, res: Response) => {
    const skip = req.query.skip as string
    const { message, product } = await productService.getAllProduct(skip)

    res.status(200).json({ message, product })

})
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { message, product } = await productService.deleteProduct(req.params.id)

    res.status(200).json({ message, product })

})
export const searchProduct = asyncHandler(async (req: Request, res: Response) => {
    const skip = req.query.skip as string
    const searchTerm = req.query.q as string

    const { message, product } = await productService.serchProduct(searchTerm, skip)

    res.status(200).json({ message, product })

})