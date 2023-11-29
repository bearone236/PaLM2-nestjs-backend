import { Test, TestingModule } from "@nestjs/testing";
import { LanguageModelController } from "./language-model.controller";

describe("LanguageModelController", () => {
  let controller: LanguageModelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LanguageModelController],
    }).compile();

    controller = module.get<LanguageModelController>(LanguageModelController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
