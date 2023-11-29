import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
config();

@Controller("prompt")
export class LanguageModelController {
  private readonly LANGUAGE_MODEL_API_KEY = process.env.LANGUAGE_MODEL_API_KEY;
  private readonly LANGUAGE_MODEL_URL = `https://generativelanguage.googleapis.com/v1beta1/models/chat-bison-001:generateMessage?key=${this.LANGUAGE_MODEL_API_KEY}`;

  @Get(":text")
  async getResponse(@Param("text") text: string, @Res() res: Response) {
    const payload = {
      prompt: {
        messages: [{ content: text }],
      },
      temperature: 0.1,
      candidate_count: 1,
    };

    try {
      const response = await fetch(this.LANGUAGE_MODEL_URL, {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      res.send(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
