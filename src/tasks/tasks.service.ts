import { Injectable, NotFoundException } from '@nestjs/common';

import { taskStatus } from './task.model';

import { createTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';
@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: TasksRepository) { }


  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user })
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        ('LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)'), {
        search: `%${search}%`
      });
    }
    const tasks = await query.getMany();
    return tasks;
  }
  async getTaskById(id: string,user:User): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id,user });

    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }


  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {

    const { title, description } = createTaskDto;
    const task = this.tasksRepository.create({
      title,
      description,
      status: taskStatus.OPEN,
      user
    })
    await this.tasksRepository.save(task);
    return task;
  }


  async deleteTask(id: string,user:User): Promise<void> {
    const found = await this.tasksRepository.delete({id,user});

    if (found.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }


  }

  async updateTaskStatus(id: string, status: taskStatus,user:User): Promise<Task> {
    const task = await this.getTaskById(id,user);
    task.status = status;
    await this.tasksRepository.save(task);
    return task;
  }
}
