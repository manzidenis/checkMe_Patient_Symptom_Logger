import { ApiProperty } from '@nestjs/swagger';

// Swagger-documented response shape for the insights endpoint
export class InsightsResponseDto {
    @ApiProperty({ description: 'Most frequent symptom in last 30 days', example: 'BREAST_PAIN', nullable: true })
    topSymptom!: string | null;

    @ApiProperty({ description: 'Count of the top symptom in last 30 days', example: 5 })
    topSymptomCount!: number;

    @ApiProperty({ description: 'Severity trend: last 7 days vs prior 7 days', enum: ['worsening', 'improving', 'stable', 'insufficient_data', 'no_data'], example: 'worsening' })
    severityTrend!: string;

    @ApiProperty({ description: 'Average severity in last 7 days', example: 3.5, nullable: true })
    avgSeverityLast7Days!: number | null;

    @ApiProperty({ description: 'Average severity in prior 7 days (days 8-14)', example: 2.0, nullable: true })
    avgSeverityPrev7Days!: number | null;

    @ApiProperty({ description: 'True if severity >= 4 logged 3+ times in last 7 days', example: false })
    alert!: boolean;

    @ApiProperty({ description: 'Human-readable alert explanation', example: 'No high-severity entries in the last 7 days' })
    alertDetails!: string;

    @ApiProperty({ description: 'Total symptom entries for this patient', example: 12 })
    totalEntries!: number;

    @ApiProperty({ description: 'Start of 30-day analysis period', example: '2026-01-18T00:00:00.000Z' })
    periodStart!: string;

    @ApiProperty({ description: 'End of analysis period (current time)', example: '2026-02-17T00:00:00.000Z' })
    periodEnd!: string;
}