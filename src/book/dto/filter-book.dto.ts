import { ApiProperty, ApiQuery } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FilterBookDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  q: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  code: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  title: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  start_year: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  end_year: number;
}
