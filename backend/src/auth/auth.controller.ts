import { Controller, Post, Body } from "@nestjs/common";
import { db } from "../database";

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();

@Controller("auth")
export class AuthController {

    @Post("request-otp")
    requestOtp(@Body("phone") phone: string) {
        const otp = generateOTP();

        db.prepare(
            "INSERT OR REPLACE INTO users (phone, otp) VALUES (?, ?)"
        ).run(phone, otp);

        console.log(`OTP for ${phone}: ${otp}`);

        return { message: "OTP sent", otp };
    }

    @Post("verify-otp")
    verifyOtp(@Body() body: any) {
        const user = db
            .prepare("SELECT * FROM users WHERE phone = ?")
            .get(body.phone);

        if (!user || user.otp !== body.otp) {
            return { success: false };
        }

        return {
            success: true,
            token: `demo-token-${body.phone}`
        };
    }
}
