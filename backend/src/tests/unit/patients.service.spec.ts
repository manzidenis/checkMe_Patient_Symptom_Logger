import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from '../../modules/patients/patients.service';
import { PrismaService } from '../../database/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Sex } from '@prisma/client';

describe('PatientsService', () => {
    let service: PatientsService;
    let prisma: PrismaService;

    const mockPrisma = {
        patient: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        user: { deleteMany: jest.fn() },
        symptomEntry: { deleteMany: jest.fn() },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PatientsService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<PatientsService>(PatientsService);
        prisma = module.get<PrismaService>(PrismaService);
        jest.clearAllMocks();
    });

    const mockPatientData = {
        id: 'uuid-1',
        firstName: 'Jane',
        lastName: 'Doe',
        middleName: 'Marie',
        dateOfBirth: new Date('1991-03-15'),
        sex: Sex.FEMALE,
        phone: '+250788123456',
        email: 'jane@example.com',
        country: 'Rwanda',
        city: 'Kigali',
        createdAt: new Date('2026-02-17T08:00:00Z'),
        updatedAt: new Date('2026-02-17T08:00:00Z'),
    };

    describe('create()', () => {
        it('should create a patient and return mapped response', async () => {
            const dto = {
                firstName: 'Jane',
                lastName: 'Doe',
                middleName: 'Marie',
                dateOfBirth: '1991-03-15',
                sex: Sex.FEMALE,
                phone: '+250788123456',
                email: 'jane@example.com',
                country: 'Rwanda',
                city: 'Kigali',
            };

            mockPrisma.patient.create.mockResolvedValue(mockPatientData);

            const result = await service.create(dto);

            expect(result.id).toBe('uuid-1');
            expect(result.firstName).toBe('Jane');
            expect(result.lastName).toBe('Doe');
            expect(result.fullName).toBe('Jane Marie Doe');
            expect(result.dateOfBirth).toBe('1991-03-15');
            expect(result.age).toBeGreaterThan(0);
            expect(result.country).toBe('Rwanda');
        });
    });

    describe('findAll()', () => {
        it('should return paginated patients with symptom counts', async () => {
            const mockPatients = [
                { ...mockPatientData, _count: { symptoms: 5 } },
                {
                    ...mockPatientData,
                    id: 'uuid-2',
                    firstName: 'John',
                    lastName: 'Smith',
                    middleName: null,
                    sex: Sex.MALE,
                    _count: { symptoms: 0 },
                },
            ];

            mockPrisma.patient.count.mockResolvedValue(2);
            mockPrisma.patient.findMany.mockResolvedValue(mockPatients);

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result.data).toHaveLength(2);
            expect(result.meta.total).toBe(2);
            expect(result.meta.page).toBe(1);
            expect(result.meta.totalPages).toBe(1);
            expect(result.data[0].symptomCount).toBe(5);
            expect(result.data[0].fullName).toBe('Jane Marie Doe');
            expect(result.data[1].fullName).toBe('John Smith');
            expect(result.data[1].symptomCount).toBe(0);
        });

        it('should return empty data when no patients exist', async () => {
            mockPrisma.patient.count.mockResolvedValue(0);
            mockPrisma.patient.findMany.mockResolvedValue([]);

            const result = await service.findAll({ page: 1, limit: 10 });

            expect(result.data).toEqual([]);
            expect(result.meta.total).toBe(0);
        });
    });

    describe('findById()', () => {
        it('should return a patient by ID with symptom count', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue({
                ...mockPatientData,
                _count: { symptoms: 3 },
            });

            const result = await service.findById('uuid-1');

            expect(result.id).toBe('uuid-1');
            expect(result.symptomCount).toBe(3);
            expect(result.phone).toBe('+250788123456');
        });

        it('should throw NotFoundException for non-existent patient', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(null);
            await expect(service.findById('non-existent')).rejects.toThrow(NotFoundException);
        });
    });

    describe('update()', () => {
        it('should update patient fields and return mapped response', async () => {
            const updated = { ...mockPatientData, firstName: 'Janet' };
            mockPrisma.patient.findUnique.mockResolvedValue(mockPatientData);
            mockPrisma.patient.update.mockResolvedValue(updated);

            const result = await service.update('uuid-1', { firstName: 'Janet' });

            expect(result.firstName).toBe('Janet');
        });

        it('should throw NotFoundException for non-existent patient', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(null);
            await expect(service.update('non-existent', { firstName: 'Test' })).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove()', () => {
        it('should delete patient and associated data', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(mockPatientData);
            mockPrisma.patient.delete.mockResolvedValue(mockPatientData);

            const result = await service.remove('uuid-1');

            expect(result.message).toBe('Patient deleted successfully');
            expect(mockPrisma.user.deleteMany).toHaveBeenCalledWith({ where: { patientId: 'uuid-1' } });
            expect(mockPrisma.symptomEntry.deleteMany).toHaveBeenCalledWith({ where: { patientId: 'uuid-1' } });
        });

        it('should throw NotFoundException for non-existent patient', async () => {
            mockPrisma.patient.findUnique.mockResolvedValue(null);
            await expect(service.remove('non-existent')).rejects.toThrow(NotFoundException);
        });
    });
});
