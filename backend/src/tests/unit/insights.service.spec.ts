import { InsightsService } from '../../modules/symptoms/insights.service';
import { SymptomEntry, SymptomType } from '@prisma/client';

// Tests InsightsService: edge cases, trends, and alerts
describe('InsightsService', () => {
    let service: InsightsService;

    beforeEach(() => {
        service = new InsightsService();
    });
    const createEntry = (
        overrides: Partial<{
            symptomType: SymptomType;
            severity: number;
            occurredAt: Date;
        }> = {},
    ): SymptomEntry => {
        return {
            id: 'test-id',
            patientId: 'patient-1',
            symptomType: overrides.symptomType ?? SymptomType.BREAST_PAIN,
            severity: overrides.severity ?? 3,
            occurredAt: overrides.occurredAt ?? new Date(),
            notes: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as SymptomEntry;
    };

    const daysAgo = (days: number): Date => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d;
    };


    describe('when patient has no symptom entries', () => {
        it('should return no_data defaults', () => {
            const result = service.compute([]);

            expect(result.topSymptom).toBeNull();
            expect(result.topSymptomCount).toBe(0);
            expect(result.severityTrend).toBe('no_data');
            expect(result.alert).toBe(false);
            expect(result.totalEntries).toBe(0);
            expect(result.avgSeverityLast7Days).toBeNull();
            expect(result.avgSeverityPrev7Days).toBeNull();
        });
    });


    describe('when patient has a single recent entry', () => {
        it('should identify top symptom but report insufficient_data for trend', () => {
            const entry = createEntry({
                symptomType: SymptomType.LUMP_DETECTED,
                severity: 3,
                occurredAt: daysAgo(2),
            });

            const result = service.compute([entry]);

            expect(result.topSymptom).toBe('LUMP_DETECTED');
            expect(result.topSymptomCount).toBe(1);
            expect(result.severityTrend).toBe('insufficient_data');
            expect(result.alert).toBe(false);
            expect(result.totalEntries).toBe(1);
        });
    });


    describe('top symptom calculation', () => {
        it('should identify the most frequent symptom in the last 30 days', () => {
            const entries = [
                createEntry({ symptomType: SymptomType.BREAST_PAIN, occurredAt: daysAgo(5) }),
                createEntry({ symptomType: SymptomType.BREAST_PAIN, occurredAt: daysAgo(10) }),
                createEntry({ symptomType: SymptomType.BREAST_PAIN, occurredAt: daysAgo(15) }),
                createEntry({ symptomType: SymptomType.FATIGUE, occurredAt: daysAgo(8) }),
                createEntry({ symptomType: SymptomType.FATIGUE, occurredAt: daysAgo(12) }),
            ];

            const result = service.compute(entries);

            expect(result.topSymptom).toBe('BREAST_PAIN');
            expect(result.topSymptomCount).toBe(3);
        });

        it('should return null when all entries are older than 30 days', () => {
            const entries = [
                createEntry({ symptomType: SymptomType.BREAST_PAIN, occurredAt: daysAgo(35) }),
                createEntry({ symptomType: SymptomType.FATIGUE, occurredAt: daysAgo(40) }),
            ];

            const result = service.compute(entries);

            expect(result.topSymptom).toBeNull();
            expect(result.topSymptomCount).toBe(0);
            expect(result.totalEntries).toBe(2);
        });
    });


    describe('severity trend — worsening', () => {
        it('should detect worsening when last 7 days avg > prior 7 days avg', () => {
            const entries = [
                createEntry({ severity: 4, occurredAt: daysAgo(1) }),
                createEntry({ severity: 5, occurredAt: daysAgo(3) }),
                createEntry({ severity: 2, occurredAt: daysAgo(9) }),
                createEntry({ severity: 1, occurredAt: daysAgo(11) }),
            ];

            const result = service.compute(entries);

            expect(result.severityTrend).toBe('worsening');
            expect(result.avgSeverityLast7Days).toBe(4.5);
            expect(result.avgSeverityPrev7Days).toBe(1.5);
        });
    });


    describe('severity trend — improving', () => {
        it('should detect improving when last 7 days avg < prior 7 days avg', () => {
            const entries = [
                createEntry({ severity: 1, occurredAt: daysAgo(2) }),
                createEntry({ severity: 2, occurredAt: daysAgo(4) }),
                createEntry({ severity: 4, occurredAt: daysAgo(9) }),
                createEntry({ severity: 5, occurredAt: daysAgo(12) }),
            ];

            const result = service.compute(entries);

            expect(result.severityTrend).toBe('improving');
        });
    });


    describe('severity trend — stable', () => {
        it('should report stable when averages are within 0.1 of each other', () => {
            const entries = [
                createEntry({ severity: 3, occurredAt: daysAgo(1) }),
                createEntry({ severity: 3, occurredAt: daysAgo(3) }),
                createEntry({ severity: 3, occurredAt: daysAgo(9) }),
                createEntry({ severity: 3, occurredAt: daysAgo(11) }),
            ];

            const result = service.compute(entries);

            expect(result.severityTrend).toBe('stable');
        });
    });


    describe('severity trend — insufficient data', () => {
        it('should report insufficient_data when only one period has entries', () => {
            const entries = [
                createEntry({ severity: 3, occurredAt: daysAgo(2) }),
                createEntry({ severity: 4, occurredAt: daysAgo(5) }),
            ];

            const result = service.compute(entries);

            expect(result.severityTrend).toBe('insufficient_data');
        });

        it('should report insufficient_data when entries only exist in prior period', () => {
            const entries = [
                createEntry({ severity: 3, occurredAt: daysAgo(9) }),
                createEntry({ severity: 4, occurredAt: daysAgo(12) }),
            ];

            const result = service.compute(entries);

            expect(result.severityTrend).toBe('insufficient_data');
        });
    });


    describe('alert condition — triggered', () => {
        it('should set alert true when 3+ entries with severity >= 4 in last 7 days', () => {
            const entries = [
                createEntry({ severity: 4, occurredAt: daysAgo(1) }),
                createEntry({ severity: 5, occurredAt: daysAgo(2) }),
                createEntry({ severity: 4, occurredAt: daysAgo(3) }),
            ];

            const result = service.compute(entries);

            expect(result.alert).toBe(true);
            expect(result.alertDetails).toContain('3');
        });

        it('should set alert true when more than 3 high-severity entries exist', () => {
            const entries = [
                createEntry({ severity: 4, occurredAt: daysAgo(1) }),
                createEntry({ severity: 5, occurredAt: daysAgo(2) }),
                createEntry({ severity: 4, occurredAt: daysAgo(3) }),
                createEntry({ severity: 5, occurredAt: daysAgo(5) }),
            ];

            const result = service.compute(entries);

            expect(result.alert).toBe(true);
        });
    });


    describe('alert condition — not triggered', () => {
        it('should set alert false with fewer than 3 high-severity entries', () => {
            const entries = [
                createEntry({ severity: 4, occurredAt: daysAgo(1) }),
                createEntry({ severity: 5, occurredAt: daysAgo(3) }),
                createEntry({ severity: 2, occurredAt: daysAgo(5) }),
            ];

            const result = service.compute(entries);

            expect(result.alert).toBe(false);
        });

        it('should not count high-severity entries older than 7 days', () => {
            const entries = [
                createEntry({ severity: 4, occurredAt: daysAgo(1) }),
                createEntry({ severity: 5, occurredAt: daysAgo(3) }),
                createEntry({ severity: 5, occurredAt: daysAgo(9) }),
                createEntry({ severity: 5, occurredAt: daysAgo(10) }),
            ];

            const result = service.compute(entries);

            expect(result.alert).toBe(false);
        });

        it('should not trigger alert for severity 3 entries', () => {
            const entries = [
                createEntry({ severity: 3, occurredAt: daysAgo(1) }),
                createEntry({ severity: 3, occurredAt: daysAgo(2) }),
                createEntry({ severity: 3, occurredAt: daysAgo(3) }),
                createEntry({ severity: 3, occurredAt: daysAgo(4) }),
            ];

            const result = service.compute(entries);

            expect(result.alert).toBe(false);
        });
    });


    describe('response metadata', () => {
        it('should include period start and end timestamps', () => {
            const result = service.compute([]);

            expect(result.periodStart).toBeDefined();
            expect(result.periodEnd).toBeDefined();
            const start = new Date(result.periodStart);
            const end = new Date(result.periodEnd);
            const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
            expect(diffDays).toBeCloseTo(30, 0);
        });

        it('should correctly round average severity values', () => {
            const entries = [
                createEntry({ severity: 3, occurredAt: daysAgo(1) }),
                createEntry({ severity: 4, occurredAt: daysAgo(2) }),
                createEntry({ severity: 2, occurredAt: daysAgo(3) }),
                createEntry({ severity: 1, occurredAt: daysAgo(9) }),
            ];

            const result = service.compute(entries);

            expect(result.avgSeverityLast7Days).toBe(3);
        });
    });
});