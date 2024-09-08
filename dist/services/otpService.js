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
exports.OtpService = void 0;
const utils_1 = require("../utils");
const middlewares_1 = require("../middlewares");
const __1 = require("..");
class OtpService {
    createOtp(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield __1.prismaClient.user.findFirst({
                    where: { id: userId },
                });
                if (!user) {
                    throw new middlewares_1.ResourceNotFound("User not found");
                }
                const token = (0, utils_1.generateNumericOTP)(6);
                const otp_expires = new Date(Date.now() + 15 * 60 * 1000);
                const otp = yield __1.prismaClient.otp.create({
                    data: {
                        token: token,
                        expiry: otp_expires,
                        userId: userId,
                    },
                });
                return otp;
            }
            catch (error) {
                return;
            }
        });
    }
    verifyOtp(userId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield __1.prismaClient.otp.findFirst({
                    where: { token, user: { id: userId } },
                });
                if (!otp) {
                    throw new middlewares_1.ResourceNotFound("Invalid OTP");
                }
                if (otp.expiry < new Date()) {
                    throw new middlewares_1.Expired("OTP has expired");
                }
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
}
exports.OtpService = OtpService;
