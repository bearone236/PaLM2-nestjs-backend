<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="150" alt="Nest Logo" /></a>
</p>

# Nest.jsを用いたPaLM2バックエンド構築

## 気になる方

Github URL :

## PaLM2 APIキー取得方法

## バックエンド環境構築

#### ①：グローバルにnestjs/cliをインストールする

```
npm install -g @nestjs/cli
```

#### ②：Nest環境を構築する

```
nest new my-project-name && cd my-project-name
```

#### ③：今回使用する外部ライブラリのインストール

```
npm install express node-fetch dotenv @nestjs/common
```

## PaLM2 APIプロジェクトの実装

・上記で取得したPaLM2 APIキーを、.envファイルに「LANGUAGE_MODEL_API_KEY」の変数で代入する
・src/main.tsファイルのPORT番号を8000番に変更

```diff_javascript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

- await app.listen(3000);
+ await app.listen(8000);
}
bootstrap();

```

#### ①：PaLM2プロジェクトのための新しいコントローラの作成/移動

・src直下で下記のコマンドを実行

```
nest generate controller language-model && cd language-model
```

#### ②：language-model.controller.tsのコード

```
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


```

#### ③：CORS設定

・main.ts内でCORSの設定を行う

```
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORSの設定を追加
  app.enableCors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  });

  await app.listen(8000);
}
bootstrap();

```

### プロジェクト実行

```
npm run start:dev
```
