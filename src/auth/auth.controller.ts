import { Post, Body, Controller, Get, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/user.dto';
import { GoogleAuthGuard, AuthenticatedGuard, LocalAuthGuard, LoginGuard } from './auth.guard';


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

    @UseGuards(LoginGuard)
    @Post('login2')
    async login2(@Request() req, @Response() res) {
        //쿠키 정보는 없지만 req에 user 정보가 있다면 로그인 프로세스를 진행한 것으로 보고 응답값에 쿠키 정보 추가
        if (!req.cookies['login'] && req.user) {
            res.cookie('login', JSON.stringify(req.user), {
                httpOnly: true,
                // maxAge : 1000 * 60 * 60 * 24 * 7,
                maxAge: 1000 * 10, // : for test
            });
        }
        return res.send({ message: 'login2 success' });
    }

    @UseGuards(LoginGuard)
    @Get('test-guard')
    testGuard(){
        return '로그인된 때만 이 글이 보입니다.';
    }

    @Get('show-cookies')
    async cookie(@Request() req, @Response() res){
        if(req.cookies['login']){
            return res.send(req.cookies['login']);
        }else {
            return res.status(404).send({ message: 'No login cookie found' });
        }
    }

    @Get('logout')
    logout(@Request() req, @Response() res) {
        res.clearCookie('login'); // 쿠키 삭제
        return res.send({ message: '로그아웃되었습니다.' });
    }

    @UseGuards(LocalAuthGuard)
    @Post('login3')
    login3(@Request() req) {
        return req.user;
    }
    
    @UseGuards(AuthenticatedGuard)
    @Get('test-guard2')
    testGuardWithSession(@Request() req) {
        return req.user;
    }
    
    @UseGuards(GoogleAuthGuard)
    @Get('to-google') // 구글 로그인으로 이동
    async googleAuth(@Request() req){}

    @UseGuards(GoogleAuthGuard)
    @Get('google')
    async googleAuthRedirect(@Request() req, @Response() res){
        const { user } = req;
        return res.send(user);
    }
}
