/*
인증 유형별 스트래티지

인증 방법 | 패키지명 | 설명
Local | passport-local | 유저명과 패스워드 인증
OAuth | passport-oauth|  페이스북, 구글, 트위터 외부 서비스
SAML | passport-saml | SAML 신원 제공자에서 인증 (OneLogin, Okta)
JWT | passport-jwt | JSON Web Token
AWS | Cognito passport-cognito | AWS Cognito user pool 인증
LDAP | passport-ldapauth | LDAP 디렉터리 인증
*/

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    // mixin/trait : 클래스의 일부만 확장하고 싶을 때 클래스에 새로운 기능을 추가하기 위해, 필요한 메서드를 가지고 있는 작은 클래스들을 결합해 기능을 추가
    constructor (private authService: AuthService) {
        super({ usernameField: 'email' }); // 기본값은 usernmame
    }

    // 유저 정보의 유효성 검증
    async validate(email: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            return null;
        }
        return user;
    }
}