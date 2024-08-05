import { IUserSignUp, IAuthService } from "../types";
import { User } from "@prisma/client";
import { prismaClient } from "..";
import { hashPassword, comparePassword, generateAccessToken } from "../utils"
import { Conflict } from "../middlewares/error";
import { OtpService, EmailService } from ".";
import { Sendmail } from "../utils/sendMail"
export class AuthService implements IAuthService {

    private otpService = new OtpService()
    private emailService = new EmailService()
    public async signUp(payload: IUserSignUp): Promise<{
        message: string;
        user: Partial<User>;
        access_token: string;
    }> {
        return await prismaClient.$transaction(async (tx) => {
            const { email, password, first_name, last_name } = payload;
            const hashedPassword = await hashPassword(password)
            let user = await tx.user.findFirst({ where: { email } });
            if (user) {

                throw new Conflict("User already exists")

            }
            const newUser = await tx.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword
                },
            });
            const access_token = await generateAccessToken(newUser.id)
            const otp = await this.otpService.createOtp(newUser.id);
            const { emailBody, emailText } = await this.emailService.otpEmailTemplate(first_name, otp!.token)

            await Sendmail({
                from: `Barb store`,
                to: email,
                subject: "OTP VERIFICATION",
                text: emailText,
                html: emailBody,
            });
            const userResponse = {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
            };
            return {
                user: userResponse,
                access_token,
                message:
                    "User Created Successfully. Kindly check your mail for your verification token",
            };
        })

    }

}