import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterBookDto } from './filter-book.dto';

export class FilterPaginatedBookDto extends IntersectionType(FilterBookDto) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take: number;
}
