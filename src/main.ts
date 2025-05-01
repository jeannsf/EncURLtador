import { NestFactory } from '@nestjs/core';
import { ShortUrlModule } from './short-url/short-url.module';

async function bootstrap() {
  const app = await NestFactory.create(ShortUrlModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
