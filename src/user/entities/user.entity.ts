import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    email: string;
    @Column()
    password: string;
    @Column({default: 'user'})
    role: string;
    @Column()
    createdAt: Date;
}
