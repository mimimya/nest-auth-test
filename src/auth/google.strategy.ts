import { Injectable } from "@nestjs/common";
import { Profile, Strategy } from "passport-google-oauth20"
import { PassportStrategy } from "@nestjs/passport";
import { UserService } from "src/user/user.service";
import { User } from "src/user/user.entity";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: 'http://localhost:3000/auth/google', // 구글 OAuth 인증 후 실행되는 URL
            scope: ['email', 'profile'], // 구글 OAuth 인증 시 요청하는 데이터
        })
    }

    // OAuth 인증이 끝나고 콜백으로 실행되는 메서드
    async validate(accessToken: string, refreshToken: string, profile: Profile){
        const { id, name, emails } = profile;
        // console.log(accessToken);
        // console.log(refreshToken);
        
        const providerId = id;
        const email = emails?.[0]?.value; // emails가 undefined일 가능성 방지

        // console.log(providerId, email, name?.familyName, name?.givenName);
        
        const user: User = await this.userService.findByEmailOrSave(
            email,
            name?.familyName as string + name?.givenName as string,
            providerId,
        );
        
        // return profile;
        return user;
    }
}