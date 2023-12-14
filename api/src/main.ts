import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  console.log(
    `==============>  env  AWS_REGION ${process.env.AWS_REGION} AWS_ACCESS_KEY_ID ${process.env.AWS_ACCESS_KEY_ID}`,
    'FileService#constructor',
  );
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 50,
    }),
  );
  await app.listen(3000);
}
bootstrap();
