import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './common/guards/jwt.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);

  app.enableCors();

  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
