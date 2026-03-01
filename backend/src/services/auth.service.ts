import axios from 'axios';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { pool } from '../db/neon.connection';
import { AppError } from '../middlewares/errorHandler';

export class AuthService {
    async requestOTP(phone: string): Promise<{ message: string }> {
        const cleanPhone = phone.replace("+", "");

        const url = `https://control.msg91.com/api/v5/otp?mobile=${cleanPhone}&template_id=${config.MSG91_TEMPLATE_ID}`;

        console.log(`[AUTH] Requesting MSG91 OTP for ${cleanPhone}`);

        try {
            const response = await axios.post(
                url,
                {},
                {
                    headers: {
                        authkey: config.MSG91_AUTH_TOKEN,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("MSG91 RESPONSE:", response.data);

            if (response.data.type !== 'success') {
                throw new Error(response.data.message || 'Failed to send OTP via MSG91');
            }

            return { message: 'OTP sent successfully' };
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message;
            console.error("MSG91 ERROR:", errorMsg);
            throw new AppError(500, `Failed to process authentication request: ${errorMsg}`);
        }
    }

    async verifyOTP(
        phone: string,
        otp: string
    ): Promise<{ token: string; user: any }> {
        const cleanPhone = phone.replace("+", "");

        console.log(`[AUTH] Verifying MSG91 OTP for ${cleanPhone}`);

        try {
            // 1. Verify OTP with MSG91
            const verifyUrl = `https://control.msg91.com/api/v5/otp/verify?mobile=${cleanPhone}&otp=${otp}`;
            const verifyResponse = await axios.get(verifyUrl, {
                headers: {
                    authkey: config.MSG91_AUTH_TOKEN
                }
            });

            console.log("MSG91 VERIFY RESPONSE:", verifyResponse.data);

            if (verifyResponse.data.type !== 'success') {
                throw new AppError(400, verifyResponse.data.message || 'Invalid OTP');
            }
        } catch (error: any) {
            if (error instanceof AppError) throw error;
            const errorMsg = error.response?.data?.message || error.message;
            console.error("MSG91 VERIFY ERROR:", errorMsg);
            throw new AppError(500, `Authentication failed: ${errorMsg}`);
        }

        // 2. Database Safety Check & User Management
        try {
            await pool.query(`
                CREATE TABLE IF NOT EXISTS users (
                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                  phone TEXT UNIQUE NOT NULL,
                  created_at TIMESTAMP DEFAULT NOW()
                );
            `);

            // Check if user exists
            const userRes = await pool.query('SELECT id, phone FROM users WHERE phone = $1', [phone]);
            let user = userRes.rows[0];

            if (!user) {
                const insertRes = await pool.query(
                    'INSERT INTO users (phone) VALUES ($1) RETURNING id, phone',
                    [phone]
                );
                user = insertRes.rows[0];
            }

            // 3. Generate JWT token
            const token = jwt.sign(
                { userId: user.id, phone: user.phone },
                config.JWT_SECRET,
                { expiresIn: "30d" }
            );

            return {
                token,
                user: {
                    id: user.id,
                    phone: user.phone
                }
            };
        } catch (error: any) {
            console.error("[AUTH] Database error in verifyOTP:", error);
            throw new AppError(500, 'Authentication failed due to database error');
        }
    }
}

export const authService = new AuthService();
