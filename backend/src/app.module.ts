import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AuthController } from "./auth/auth.controller";

@Module({
  controllers: [
    AppController,
    AuthController
  ],
  providers: [],
})
export class AppModule { }
