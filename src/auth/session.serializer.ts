import { Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { PassportSerializer } from "@nestjs/passport";

@Injectable()
export class SessionSerializer extends PassportSerializer {
    constructor ( private userService: UserService) {
        super();
    }
    // 세션 정보 저장
    serializeUser(user: any, done: (err: Error | null, user: any) => void):any {
        done(null, user.email); // 세션에 저장할 정보 ; 유저 식별 최소 정보 email
    }

    // 세션 정보 꺼내기
    async deserializeUser(
        payload: any,
        done: (err: Error| null, payload: any) => void,
    ): Promise<any> {
        const user = await this.userService.getUser(payload); // payload: email

        if(!user){
            done(new Error('No User'), null);
            return;
        }
        const { password, ...userInfo } = user; // userInfo : 패스워드를 뺀 나머지 user 정보 전달
        
        done(null, userInfo);
    }
    // + getPassportInstance() : 패스포트 인스턴스를 가져올 때 사용
}