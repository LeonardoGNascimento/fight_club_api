import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Domínio que pode fazer requisições para sua API
    credentials: true, // Permite o envio de cookies
  });
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
