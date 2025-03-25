import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 전역 파이프에 validationPipe 추가
  /*

  프로젝트 전체에서 유효성 검증 : ValidationPipe +class-transformer
  개별 메서드에서 상세한 유효성 검증 : @UsePipes 데코레이터, Joi 라이브러리 (스키마 만들기, 메서드마다 @UsePipes 데코레이터 붙여야 함)
  */
  app.use(cookieParser()); // 쿠키 파서 설정
  app.use(
    session({
      secret: 'very-important-secret', // 세션 암호화 키
      resave: false, // 세션 항상 저장할지 여부
      saveUninitialized: false, // 세션이 저장되기 전에는 빈 값을 저장할지 여부 인증되지 않은 사용자 정보 빈값으로 저장, 불필요한 공간 차지 안하게 false
      cookie: { maxAge: 3600000}, // 세션을 찾는데 사용할 키값을 쿠기에 저장, 유효 1시간
    })
  );
  app.use(passport.initialize()); // passport 초기화
  app.use(passport.session()); // 세션 저장소 초기화 저장소 지정 안하면 메모리에 저장됨
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
