import { IsString, IsEnum, IsNotEmpty, IsDateString, IsEmail, Matches, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sex } from '@prisma/client';

const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

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

  @ApiProperty({ description: 'Phone number in E.164 format', example: '+250788123456' })
  @IsString()
  @IsNotEmpty()
  @Matches(E164_PHONE_REGEX, { message: 'Phone number must be in international format, e.g. +250788123456' })
  phone!: string;

  @ApiProperty({ description: 'Email address', example: 'jane@example.com' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({ description: 'Country', example: 'Rwanda' })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({ description: 'City', example: 'Kigali' })
  @IsString()
  @IsNotEmpty()
  city!: string;
}
