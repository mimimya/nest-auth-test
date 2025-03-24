import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";

@Injectable()
export class LoginGuard implements CanActivate {
    /*
    가드 내에서 응답에 쿠키를 설정할 수 없다.
    가드는 모든 미들웨어의 실행이 끝난 다음, filter나 pipe 보다 먼저 실행된다.
    */
    constructor(private authService: AuthService) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
         // 요청의 body가 undefined일 경우 빈 객체로 초기화
        const body = request.body || {};
        
        // 쿠키가 있으면 인증된 것
        if (request.cookies['login']) {
            return true;
        }
        // 쿠키가 없으면 body 정보 확인
        else if (!body.email || !body.password) {
            return false;
        }

        // auth.Service.validateUser
        const user = await this.authService.validateUser(
            request.body.email,
            request.body.password,
        );

        if(!user){
            return false;
        }
        request.user = user;
        return true;
    }
}