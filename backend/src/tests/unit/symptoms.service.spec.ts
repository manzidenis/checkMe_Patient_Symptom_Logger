import { Test, TestingModule } from '@nestjs/testing';
import { SymptomsService } from '../../modules/symptoms/symptoms.service';
import { PrismaService } from '../../database/prisma.service';
import { InsightsService } from '../../modules/symptoms/insights.service';
import { NotFoundException } from '@nestjs/common';
import { SymptomType } from '@prisma/client';

// Unit tests for SymptomsService with mocked dependencies
describe('SymptomsService', () => {
    let service: SymptomsService;

    const mockPrisma = {
        patient: {
            findUnique: jest.fn(),
        },
        symptomEntry: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
    };

    const mockInsightsService = {
        compute: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SymptomsService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: InsightsService, useValue: mockInsightsService },
            ],
        }).compile();

        service = module.get<SymptomsService>(SymptomsService);
        jest.clearAllMocks();
    });

    describe('create()', () => {
        const validDto = {
            symptomType: SymptomType.BREAST_PAIN,
            severity: 3,
            occurredAt: '2026-02-15T10:00:00.000Z',
            notes: 'Test pain',
        };

        it('should create a symptom entry when patient exists', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue({ id: 'patient-1' });

            const mockEntry = {
                id: 'entry-1',
                patientId: 'patient-1',
                ...validDto,
                occurredAt: new Date(validDto.occurredAt),
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.symptomEntry.create.mockResolvedValue(mockEntry);

            const result = await service.create('patient-1', validDto);

            expect(mockPrisma.patient.findUnique).toHaveBeenCalledWith({
                where: { id: 'patient-1' },
            });
            expect(result.id).toBe('entry-1');
            expect(result.symptomType).toBe('BREAST_PAIN');
        });

        it('should throw NotFoundException when patient does not exist', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(null);

            await expect(service.create('invalid-id', validDto)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('findAll()', () => {
        it('should return paginated symptom entries with filters', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue({ id: 'patient-1' });
            mockPrisma.symptomEntry.count.mockResolvedValue(2);
            mockPrisma.symptomEntry.findMany.mockResolvedValue([
                {
                    id: 'entry-1',
                    patientId: 'patient-1',
                    symptomType: SymptomType.BREAST_PAIN,
                    severity: 3,
                    occurredAt: new Date(),
                    notes: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ]);

            const result = await service.findAll('patient-1', {
                symptomType: SymptomType.BREAST_PAIN,
                page: 1,
                limit: 10,
            });

            expect(result.data).toHaveLength(1);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
        });

        it('should throw NotFoundException for non-existent patient', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(null);

            await expect(
                service.findAll('invalid-id', { page: 1, limit: 10 }),
            ).rejects.toThrow(NotFoundException);
        });

        it('should handle date range filters', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue({ id: 'patient-1' });
            mockPrisma.symptomEntry.count.mockResolvedValue(0);
            mockPrisma.symptomEntry.findMany.mockResolvedValue([]);

            await service.findAll('patient-1', {
                from: '2026-02-01',
                to: '2026-02-15',
                page: 1,
                limit: 10,
            });

            expect(mockPrisma.symptomEntry.findMany).toHaveBeenCalled();
            const callArgs = mockPrisma.symptomEntry.findMany.mock.calls[0][0];
            expect(callArgs.where.occurredAt).toBeDefined();
            expect(callArgs.where.occurredAt.gte).toEqual(new Date('2026-02-01'));
            expect(callArgs.where.occurredAt.lte).toEqual(new Date('2026-02-15'));
        });
    });

    describe('getInsights()', () => {
        it('should return computed insights for a patient', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue({ id: 'patient-1' });
            mockPrisma.symptomEntry.findMany.mockResolvedValue([]);
            mockInsightsService.compute.mockReturnValue({
                topSymptom: null,
                severityTrend: 'no_data',
                alert: false,
                totalEntries: 0,
            });

            const result = await service.getInsights('patient-1');

            expect(mockInsightsService.compute).toHaveBeenCalledWith([]);
            expect(result.alert).toBe(false);
        });

        it('should throw NotFoundException for non-existent patient', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(null);

            await expect(service.getInsights('invalid-id')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
