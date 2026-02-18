import { IsEnum, IsInt, Min, Max, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SymptomType } from '@prisma/client';

export class CreateSymptomDto {
  @ApiProperty({ description: 'Symptom type from predefined list', enum: SymptomType, example: 'BREAST_PAIN' })
  @IsEnum(SymptomType)
  symptomType!: SymptomType;

  @ApiProperty({ description: 'Severity: 1 (mild) to 5 (severe)', minimum: 1, maximum: 5, example: 3 })
  @IsInt()
  @Min(1)
  @Max(5)
  severity!: number;

  @ApiProperty({ description: 'Date of occurrence (ISO 8601)', example: '2026-02-15T10:00:00.000Z' })
  @IsDateString()
  occurredAt!: string;

  @ApiPropertyOptional({ description: 'Optional notes', example: 'Pain worsens in the morning' })
  @IsOptional()
  @IsString()
  notes?: string;
}
