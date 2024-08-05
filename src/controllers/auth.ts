import { NextFunction, Request, Response } from "express";
import { SignUpSchema } from "../schema";
import { AuthService } from "../services";
import { NotFoundException } from "../exceptions/notFound";
import asyncHandler from "../middlewares/asyncHandler"

const authService = new AuthService();

export const signup = asyncHandler(async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { user, access_token, message } = await authService.signUp(req.body);


    res.status(201).json({ message, access_token, user });
});

// export const login = async (req: Request, res: Response) => {
//     const { email, password } = req.body;
//     let user = await prismaClient.user.findFirst({ where: { email } });
//     if (!user) {
//         throw new NotFoundException(
//             "Email and password doesn't match",
//             ErrorCode.USER_NOT_FOUND
//         );
//     }
//     if (!compareSync(password, user.password)) {
//         throw new NotFoundException(
//             "Email and password doesn't match",
//             ErrorCode.INCORRECT_PASSWORD
//         );
//     }

//     const token = jwt.sign({ userId: user.id }, JWT_SCERET);
//     res.status(200).json({ user, token });
// };
