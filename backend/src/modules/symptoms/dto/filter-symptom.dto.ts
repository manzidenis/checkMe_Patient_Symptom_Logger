import { IsOptional, IsEnum, IsInt, Min, Max, IsDateString, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { SymptomType } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterSymptomDto {
    @ApiPropertyOptional({ description: 'Filter by symptom type', enum: SymptomType })
    @IsOptional()
    @IsEnum(SymptomType)
    symptomType?: SymptomType;

    @ApiPropertyOptional({ description: 'Filter by severity level (1-5)', minimum: 1, maximum: 5 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    severity?: number;

    @ApiPropertyOptional({ description: 'Start of date range (ISO 8601)', example: '2026-02-01' })
    @IsOptional()
    @IsDateString()
    from?: string;

    @ApiPropertyOptional({ description: 'End of date range (ISO 8601)', example: '2026-02-15' })
    @IsOptional()
    @IsDateString()
    to?: string;

    @ApiPropertyOptional({ description: 'Sort field', enum: ['occurredAt', 'severity', 'symptomType', 'createdAt'], default: 'occurredAt' })
    @IsOptional()
    @IsString()
    sortBy?: string = 'occurredAt';

    @ApiPropertyOptional({ description: 'Sort direction', enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc' = 'desc';

    @ApiPropertyOptional({ description: 'Page number', default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Items per page', default: 10, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 10;
}
