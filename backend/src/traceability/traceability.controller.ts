import { Controller, Post, Body } from "@nestjs/common";
import { db } from "../database";

@Controller("traceability")
export class TraceabilityController {

    @Post("register")
    register(@Body() body: any) {
        db.prepare(
            `INSERT INTO batches (batchId, region, harvest_date)
       VALUES (?, ?, ?)`
        ).run(body.batchId, body.region, body.harvest_date);

        return { status: "registered" };
    }
}
