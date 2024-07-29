import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as session from 'express-session';
import { logger } from './logger.middleware';

async function bootstrap() {
  //  const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
  //app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');


  // because of sending large bookmarks json data from client
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  app.use(
    session({
      secret: 'appleDog56879.homePinkYellow',  
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }   // 7 days
    }),
  );
  app.use(logger);

  const config = new DocumentBuilder()
    .setTitle('Bookmarks API')
    .setDescription('API documentation for Bookmarks service')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('bookmarks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Bookmarks Server is running on http://localhost:${port}`);
}

bootstrap();
