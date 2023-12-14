import { NestFactory } from '@nestjs/core';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    allowedHeaders: '*',
  });

  console.log(
    `==============>  env  AWS_REGION ${process.env.AWS_REGION} AWS_ACCESS_KEY_ID ${process.env.AWS_ACCESS_KEY_ID}`,
    'FileService#constructor',
  );
  app.use(
    '/graphql',
    graphqlUploadExpress({
      maxFileSize: process.env.MAX_FILE_SIZE || 1024 * 1024 * 50,
    }),
  );
  await app.listen(3000);
}
bootstrap();
