import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/user.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(private userService: UserService){}
    // 컨트롤러 Promise 처리 중요!
    async register(userDto: CreateUserDto) {
        const user = await this.userService.getUser(userDto.email);
        if (user) {
            throw new HttpException('해당 유저가 이미 있습니다.', HttpStatus.BAD_REQUEST,);
        }
        const encryptedPassword = bcrypt.hashSync(userDto.password, 10); // 10번 암호화 처리
        
        try {
            const user = await this.userService.createUser({
                ...userDto,
                password: encryptedPassword,
            });
            user.password = undefined; // 회원가입 처리 후 패스워드 정보를 undefined로 해서 보안 처리
            return user;
        }catch (error){
            throw new HttpException('서버에러', 500);
        }

    }

    async validateUser(email: string, password: string) {
        const user = await this.userService.getUser(email);
        if(!user) {
            return null;
        }
        const { password: hashedPassword, ...userInfo } = user;
        if (!hashedPassword) {return null;}
        if (bcrypt.compareSync(password, hashedPassword)) {
            // Argument of type 'string | undefined' is not assignable to parameter of type 'string'.
            // Type 'undefined' is not assignable to type 'string'.ts(2345)
            return userInfo;
        }
        return null
    }

}
