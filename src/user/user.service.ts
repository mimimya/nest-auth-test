import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>, //엔티티 객체를 타입으로 추가
    ) {}

    createUser(user) : Promise<User> {
        return this.userRepository.save(user);
    }

    async getUser(email: string) {
        const result = await this.userRepository.findOne({
            where:{ email },
        });
        return result;
    }

    async updateUser(email, _user) :Promise<User> {
        const user : any = await this.getUser(email);
        
        // 유저가 존재하지 않는 경우 예외 처리
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        console.log('Existing user:', user);  // 확인용 로그
        // email은 식별자이므로 변경하지 않음.
        user.username = _user.username; // TypeError: Cannot read properties of undefined (reading 'username')
        user.password = _user.password;

        return await this.userRepository.save(user);
    }

    deleteUser(email: any) {
        return this.userRepository.delete({ email }); // {email: email}
    }
}
