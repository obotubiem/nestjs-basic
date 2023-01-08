import { IntersectionType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterUserDto } from './filter-user.dto';

export class FilterPaginatedUserDto extends IntersectionType(FilterUserDto) {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take: number;
}
