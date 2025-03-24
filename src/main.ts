import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 전역 파이프에 validationPipe 추가
  /*

  프로젝트 전체에서 유효성 검증 : ValidationPipe +class-transformer
  개별 메서드에서 상세한 유효성 검증 : @UsePipes 데코레이터, Joi 라이브러리 (스키마 만들기, 메서드마다 @UsePipes 데코레이터 붙여야 함)
  */
  app.use(cookieParser()); // 쿠키 파서 설정
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
