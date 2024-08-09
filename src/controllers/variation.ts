import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler"
import { VariationService } from "../services";

const variationService = new VariationService()
export const createVariation = asyncHandler(async (req: Request, res: Response) => {
    const { message, data } = await variationService.createVariation(req.body);
    res.status(201).json({ message, data });
});
export const updateVariation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {

    const variationId = req.params.id;

    const payload = req.body;

    const { message, data } = await variationService.updateVariation(variationId, payload);
    res.status(200).json({ message, data });

});

export const deleteVariation = (asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { message, data } = await variationService.deleteVariation(id);
    res.status(200).send({ message, data });
}));
export const getAllVariation = (asyncHandler(async (req: Request, res: Response) => {
    const skip = req.query.skip as string

    const { message, data } = await variationService.getAllVariation(skip);
    res.status(200).send({ message, data });
}));