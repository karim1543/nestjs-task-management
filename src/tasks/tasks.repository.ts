import { Entity, EntityRepository, Repository } from "typeorm";
import { Task } from "./task.entity";

@Entity()
export class TasksRepository extends Repository<Task>{

}