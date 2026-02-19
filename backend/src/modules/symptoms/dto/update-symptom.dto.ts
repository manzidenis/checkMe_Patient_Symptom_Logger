import { IsEnum, IsInt, Min, Max, IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { SymptomType } from '@prisma/client';
import { MaxWords } from '../../../common/validators/max-words.validator';

export class UpdateSymptomDto {
    @ApiPropertyOptional({ description: 'Symptom type from predefined list', enum: SymptomType, example: 'BREAST_PAIN' })
    @IsOptional()
    @IsEnum(SymptomType)
    symptomType?: SymptomType;

    @ApiPropertyOptional({ description: 'Severity: 1 (mild) to 5 (severe)', minimum: 1, maximum: 5, example: 3 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(5)
    severity?: number;

    @ApiPropertyOptional({ description: 'Date of occurrence (ISO 8601)', example: '2026-02-15T10:00:00.000Z' })
    @IsOptional()
    @IsDateString()
    occurredAt?: string;

    @ApiPropertyOptional({
        description: 'Optional notes (maximum 90 words)',
        example: 'Pain worsens in the morning',
    })
    @IsOptional()
    @IsString()
    @MaxWords(90, { message: 'Notes must contain at most 90 words' })
    notes?: string;
}
