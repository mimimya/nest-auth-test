import { Post, Body, Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    // CreateUserDto 에서 class-validator가 자동으로 유효성 검증
    async register(@Body() userDto: CreateUserDto) {
        // AuthService를 사용해 user 정보 저장
        return await this.authService.register(userDto);
    }
}
