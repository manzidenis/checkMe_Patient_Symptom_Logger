import { IsString, IsEnum, IsOptional, IsDateString, IsEmail, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Sex } from '@prisma/client';

const E164_PHONE_REGEX = /^\+[1-9]\d{7,14}$/;

export class UpdatePatientDto {
    @ApiPropertyOptional({ description: 'First name', example: 'Jane' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ description: 'Last name', example: 'Doe' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ description: 'Middle name', example: 'Marie' })
    @IsOptional()
    @IsString()
    middleName?: string;

    @ApiPropertyOptional({ description: 'Date of birth (ISO 8601)', example: '1984-03-15' })
    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @ApiPropertyOptional({ description: 'Biological sex', enum: Sex, example: 'FEMALE' })
    @IsOptional()
    @IsEnum(Sex)
    sex?: Sex;

    @ApiPropertyOptional({ description: 'Phone number in E.164 format', example: '+250788123456' })
    @IsOptional()
    @IsString()
    @Matches(E164_PHONE_REGEX, { message: 'Phone number must be in international format, e.g. +250788123456' })
    phone?: string;

    @ApiPropertyOptional({ description: 'Email address', example: 'jane@example.com' })
    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;

    @ApiPropertyOptional({ description: 'Country', example: 'Rwanda' })
    @IsOptional()
    @IsString()
    country?: string;

    @ApiPropertyOptional({ description: 'City', example: 'Kigali' })
    @IsOptional()
    @IsString()
    city?: string;
}
