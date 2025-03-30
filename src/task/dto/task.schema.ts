import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ enum: ['todo', 'in-progress', 'done'], default: 'todo' })
  status: 'todo' | 'in-progress' | 'done';
}


export const TaskSchema = SchemaFactory.createForClass(Task);