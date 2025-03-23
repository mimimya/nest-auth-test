import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn() // pk, 자동증가
  id?: number; // ?: 선택적인 값 : 자동증가하는 값이므로 생성할 때 필요없음.

  @Column({ unique: true }) //중복 허용하지 않음
  email: string;

  @Column()
  password?: string; //auth.service.ts : user.password = undefined;

  @Column()
  username: string;

  @Column({ default: true }) // 기본값 사용
  createdDt: Date = new Date();
}
