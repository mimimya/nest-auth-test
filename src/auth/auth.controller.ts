import { Post, Body, Controller, Get, Request, Response } from '@nestjs/common';
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

    @Post('login')
    async login(@Request() req, @Response() res){
        const userInfo = await this.authService.validateUser(
            req.body.email,
            req.body.password
        );

        if(userInfo){
            res.cookie('login', JSON.stringify(userInfo), {
                httpOnly : false, // 기본 false ; 브라우저에서 쿠키 읽기 허용
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7days
            });
            return res.send({message: 'login success'});
        }
    }
}
