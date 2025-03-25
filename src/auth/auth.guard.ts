import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
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

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const result = (await super.canActivate(context)) as boolean;
        // 로컬 스트레티지 실행
        const request = context.switchToHttp().getRequest();
        await super.logIn(request); // 내부적으로 request에 있는 user 정보를 꺼내 전달할 때  serializeUser() 실행함
        return result;
    }
}

@Injectable()
export class AuthenticatedGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated(); // 세션에서 정보를 읽어 인증 확인
    }
}