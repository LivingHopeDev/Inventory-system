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
exports.AuthService = void 0;
const __1 = require("..");
const utils_1 = require("../utils");
const error_1 = require("../middlewares/error");
const _1 = require(".");
const sendMail_1 = require("../utils/sendMail");
class AuthService {
    constructor() {
        this.otpService = new _1.OtpService();
        this.emailService = new _1.EmailService();
    }
    signUp(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, first_name, last_name } = payload;
            const hashedPassword = yield (0, utils_1.hashPassword)(password);
            let user = yield __1.prismaClient.user.findFirst({ where: { email } });
            if (user) {
                throw new error_1.Conflict("User already exists");
            }
            const newUser = yield __1.prismaClient.user.create({
                data: {
                    first_name,
                    last_name,
                    email,
                    password: hashedPassword,
                },
            });
            const access_token = yield (0, utils_1.generateAccessToken)(newUser.id);
            const otp = yield this.otpService.createOtp(newUser.id);
            const { emailBody, emailText } = yield this.emailService.otpEmailTemplate(first_name, otp.token);
            yield (0, sendMail_1.Sendmail)({
                from: `hopedigital2021@outlook.com`,
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
                message: "User Created Successfully. Kindly check your mail for your verification token",
            };
        });
    }
    login(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = payload;
            const user = yield __1.prismaClient.user.findFirst({ where: { email } });
            if (!user) {
                throw new error_1.ResourceNotFound("User not found");
            }
            const isPasswordValid = yield (0, utils_1.comparePassword)(password, user.password);
            if (!isPasswordValid) {
                throw new error_1.BadRequest("Authentication failed");
            }
            const access_token = yield (0, utils_1.generateAccessToken)(user.id);
            const userResponse = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            };
            return {
                user: userResponse,
                access_token,
                message: "Login successful",
            };
        });
    }
}
exports.AuthService = AuthService;
