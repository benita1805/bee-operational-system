import { Controller, Post, Body } from "@nestjs/common";
import { db } from "../database";

@Controller("feedback")
export class FeedbackController {

    @Post()
    submit(@Body("message") message: string) {
        db.prepare(
            `INSERT INTO feedback (message, created_at)
       VALUES (?, ?)`
        ).run(message, new Date().toISOString());

        return { received: true };
    }
}
