import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';

export class FilterBookDto {
  @IsOptional()
  q: string;

  @IsOptional()
  code: string;

  @IsOptional()
  title: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  start_year: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  end_year: number;
}
