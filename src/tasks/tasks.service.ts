import { Injectable } from '@nestjs/common';
import { Task } from './task.model';
import { taskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { createTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
@Injectable()
export class TasksService {
    private tasks: Task[] = [];
    getAllTasks(): Task[] {
        return this.tasks;
    }
    getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
        const { status, search } = filterDto;
        let tasks = this.getAllTasks();
        if (status) {
            tasks = tasks.filter(task => task.status === status);
        }
        if (search) {
            tasks = tasks.filter((task) => {
                if (task.title.includes(search) || task.description.includes(search)) {
                    return true;
                }
            })
        }
    }

    getTaskById(id: string): Task | undefined {

        return this.tasks.find((task) => task.id === id)
    }
    createTask(createTaskDto: createTaskDto): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuidv4(),
            title,
            description,
            status: taskStatus.OPEN
        }
        this.tasks.push(task);
        return task;
    }


    deleteTask(id: string): void {
        this.tasks = this.tasks.filter((task) => task.id !== id);
    }
    updateTaskStatus(id: string, status: taskStatus): Task {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }
}
