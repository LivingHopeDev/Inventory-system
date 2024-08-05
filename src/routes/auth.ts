import { SignUpSchema } from "../schema";
import { validateData } from "../middlewares";
import { signup } from "../controllers"
import { Router } from "express";

const authRoute = Router();

authRoute.post("/register", validateData(SignUpSchema), signup);
// authRoute.post("verify-otp", validateData(otpSchema), verifyOtp);
// authRoute.post("login", validateData(loginSchema), signUp);

export { authRoute };
