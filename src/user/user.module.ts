import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // 서비스에서 사용하는 리포지도리 모듈에 등록 (서비스에서 리포지토리를 찾는 데 사용)
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // UserService를 외부 모듈에서 사용하도록 설정
  /*
  @Injectable() 이 붙어있는 프로바이더는 같은 모듈, 다른 클래스에서 주입해 사용할 수 있음
  다른 모듈에서 사용하려면 @Module 속성으로 exports에 프로바이더를 넣어주어야 함
   */
})
export class UserModule {}
