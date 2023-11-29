import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LanguageModelController } from "./language-model/language-model.controller";

@Module({
  imports: [],
  controllers: [AppController, LanguageModelController],
  providers: [AppService],
})
export class AppModule {}
