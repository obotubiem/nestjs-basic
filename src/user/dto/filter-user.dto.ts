import { IsOptional } from 'class-validator';

export class FilterUserDto {
  @IsOptional()
  q: string;

  @IsOptional()
  username: string;

  @IsOptional()
  email: string;
}
