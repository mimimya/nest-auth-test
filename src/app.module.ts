import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'nest-auth-test.sqlite', // 데이터베이스 파일명
      entities: [User],
      synchronize: true, // 데이터베이스에 스키마를 동기화 (개발환경에서만 사용)
      logging: true, // SQL 실행 로그 확인
    }),
    UserModule,
    AuthModule,
    ConfigModule.forRoot(), // .env 설정 (OAuth API)
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
