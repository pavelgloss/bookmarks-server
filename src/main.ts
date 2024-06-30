import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const serverPort = 3000;

async function bootstrap() {
  //  const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  //app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');


  // because of sending large bookmarks json data from client
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('Bookmarks API')
    .setDescription('API documentation for Bookmarks service')
    .setVersion('1.0')
    .addTag('bookmarks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // SwaggerModule.setup('api-docs', app, document);
  SwaggerModule.setup('api', app, document);

  await app.listen(serverPort);
  console.log(`Bookmarks Server is running on http://localhost:${serverPort}`);
}

bootstrap();
