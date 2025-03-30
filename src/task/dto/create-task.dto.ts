import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty({ message: 'Tiêu đề task không được để trống' })
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
