import { conf } from "./src/conf.mjs";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from "./src/app.module.mjs";
import * as requestIp from 'request-ip';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { join, dirname } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { Request, Response } from 'express';


const PORT = conf.Api.https || 5000;
const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

const config =  new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Online Store')
    .setDescription('REST API documentation for the Online Store project')
    .setVersion('1.0.0')
    .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('/api/docs', app, document)

app.useGlobalPipes(new ValidationPipe())
app.use(requestIp.mw());

app.useStaticAssets(join(__dirname, '..', 'assets', 'photo'), { prefix: '/photo/' });
app.use("/robots.txt", (req : Request, res : Response, next : Function) => {
    res.status(200).end(`User-agent: *\nDisallow: *\nAllow: /trucks/\n`);
})

await app.listen(PORT, () => console.log(`server started on port ${conf.Api.https}`));


