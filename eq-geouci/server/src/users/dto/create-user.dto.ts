import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'The lapel of the user' })
  @IsString()
  @IsNotEmpty()
  lapel: string;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  ist_resident?: boolean;

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  suspended?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason_suspension?: string;
}
