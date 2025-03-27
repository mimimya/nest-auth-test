import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // pk, 자동증가
  id?: number; // ?: 선택적인 값 : 자동증가하는 값이므로 생성할 때 필요없음.

  @Column({ unique: true }) //중복 허용하지 않음
  email: string;

  @Column({ nullable: true }) // OAuth 인증 시 알 수 없음
  password?: string; //auth.service.ts : user.password = undefined;

  @Column()
  username: string;

  @Column({ default: true }) // 기본값 사용
  createdDt: Date = new Date();

  @Column({ nullable: true }) // OAuth 이외 가입자
  providerId: string; // OAuth 인증 시 식별자
}

