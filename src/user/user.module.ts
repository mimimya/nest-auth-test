import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 서비스에서 사용하는 리포지도리 모듈에 등록 (서비스에서 리포지토리를 찾는 데 사용)
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
