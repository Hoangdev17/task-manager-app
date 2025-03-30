import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './dto/task.schema';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  async create(dto: CreateTaskDto, userId: string) {
    const newTask = new this.taskModel({
      ...dto,
      createdBy: userId,
    });
    return newTask.save();
  }

  async update(id: string, dto: UpdateTaskDto, userId: string) {
    const task = await this.taskModel.findById(id);
    if (!task || task.createdBy.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền sửa task này');
    }

    return this.taskModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string, userId: string) {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task không tồn tại');
    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException('Bạn không có quyền xoá task này');
    }
    await this.taskModel.findByIdAndDelete(id);
    return { message: 'Task đã được xoá thành công' };
  }

  async findAllByUser(userId: string) {
    return this.taskModel.find({ createdBy: userId }).sort({ createdAt: -1 });
  }
}
