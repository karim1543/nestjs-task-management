import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { taskStatus } from './task.model';
import { createTaskDto } from './dto/create-task-dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter-dto';
import { UpdateTaskStatusDto } from './dto/update-task-status-dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { getUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksService: TasksService) { }
    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto,
        @getUser() user: User
    ): Promise<Task[]> {


        return this.tasksService.getTasks(filterDto, user);

    }

    @Get('/:id')
    getTaskById(@Param('id') id: string,
        @getUser() user: User
    ): Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    createTask(
        @Body() createTaskDto: createTaskDto, user: User
    ): Promise<Task> {
        return this.tasksService.createTask(createTaskDto, user);

    }

    @Delete('/:id')
    deleteTask(
        @Param('id') id: string,
        @getUser() user: User) {
        return this.tasksService.deleteTask(id,user);
    }
    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @getUser() user: User
    ): Promise<Task> {
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status, user);
    }

}
