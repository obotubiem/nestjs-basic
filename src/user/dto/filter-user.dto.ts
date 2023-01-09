import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FilterUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  q: string;

  @ApiProperty({ required: false })
  @IsOptional()
  username: string;

  @ApiProperty({ required: false })
  @IsOptional()
  email: string;
}
