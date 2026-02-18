import { IsString, IsEnum, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sex } from '@prisma/client';

export class CreatePatientDto {
  @ApiProperty({ description: 'First name', example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @ApiPropertyOptional({ description: 'Middle name', example: 'Marie' })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Date of birth (ISO 8601)', example: '1984-03-15' })
  @IsDateString()
  dateOfBirth!: string;

  @ApiProperty({ description: 'Biological sex', enum: Sex, example: 'FEMALE' })
  @IsEnum(Sex)
  sex!: Sex;

  @ApiProperty({ description: 'Phone number', example: '+250788123456' })
  @IsString()
  @IsNotEmpty()
  phone!: string;

  @ApiPropertyOptional({ description: 'Email address', example: 'jane@example.com' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({ description: 'Country', example: 'Rwanda' })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ description: 'City', example: 'Kigali' })
  @IsString()
  @IsNotEmpty()
  city!: string;
}
