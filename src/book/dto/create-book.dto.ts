import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsInt } from 'class-validator';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  year: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  description: string;
}
