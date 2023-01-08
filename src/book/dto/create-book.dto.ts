import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  year: number;

  @IsOptional()
  description: string;
}
