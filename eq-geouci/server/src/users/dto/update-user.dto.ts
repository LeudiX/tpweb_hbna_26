import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lapel?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  ist_resident?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  suspended?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reason_suspension?: string;
}
