import { z } from 'zod';

export const requestOTPSchema = z.object({
    body: z.object({
        phone: z
            .string()
            .min(10, 'Phone number must be at least 10 digits')
            .max(15, 'Phone number must not exceed 15 digits')
            .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'),
    }),
});

export const verifyOTPSchema = z.object({
    body: z.object({
        phone: z.string(),
        otp: z.string().length(6, 'OTP must be 6 digits'),
    }),
});

export type RequestOTPInput = z.infer<typeof requestOTPSchema>['body'];
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>['body'];
