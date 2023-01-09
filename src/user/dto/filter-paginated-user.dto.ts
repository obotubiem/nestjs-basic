import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { FilterUserDto } from './filter-user.dto';

export class FilterPaginatedUserDto extends IntersectionType(FilterUserDto) {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  skip: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  take: number;
}
