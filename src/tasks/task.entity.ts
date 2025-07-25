import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { taskStatus } from "./task.model";
import { User } from "src/auth/user.entity";
import { Exclude } from "class-transformer";

@Entity()
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    title: string;
    @Column()
    description: string;
    @Column()
    status: taskStatus
    @ManyToOne((_type) => User, user => user.tasks, { eager: false })
    @Exclude({toPlainOnly:true})
    user: User
}