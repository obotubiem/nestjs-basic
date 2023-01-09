import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@admin.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'password@123',
  })
  @IsNotEmpty()
  password: string;
}
