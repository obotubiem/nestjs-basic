import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterBookDto } from './filter-book.dto';

export class FilterPaginatedBookDto extends IntersectionType(FilterBookDto) {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take: number;
}
