 import { Entity, EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";

 
 @Entity()
 export class UsersRepository extends Repository<User>{
 
 }