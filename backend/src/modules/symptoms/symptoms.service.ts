import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { InsightsService } from './insights.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { FilterSymptomDto } from './dto/filter-symptom.dto';
import { SymptomMapper } from './mappers/symptom.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class SymptomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly insightsService: InsightsService,
  ) { }

  // Validates patient exists, then creates the symptom entry
  async create(patientId: string, dto: CreateSymptomDto) {
    await this.ensurePatientExists(patientId);

    const entry = await this.prisma.symptomEntry.create({
      data: {
        patientId,
        symptomType: dto.symptomType,
        severity: dto.severity,
        occurredAt: new Date(dto.occurredAt),
        notes: dto.notes,
      },
    });

    return SymptomMapper.toResponse(entry);
  }

  // Builds a dynamic Prisma where clause from filter params and returns paginated results
  async findAll(patientId: string, filters: FilterSymptomDto) {
    await this.ensurePatientExists(patientId);

    const where: Prisma.SymptomEntryWhereInput = { patientId };

    if (filters.symptomType) {
      where.symptomType = filters.symptomType;
    }

    if (filters.severity) {
      where.severity = filters.severity;
    }

    if (filters.from || filters.to) {
      where.occurredAt = {};
      if (filters.from) {
        where.occurredAt.gte = new Date(filters.from);
      }
      if (filters.to) {
        where.occurredAt.lte = new Date(filters.to);
      }
    }

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    const allowedSortFields = ['occurredAt', 'severity', 'symptomType', 'createdAt'];
    const sortBy = allowedSortFields.includes(filters.sortBy ?? '') ? filters.sortBy! : 'occurredAt';
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

    const [total, entries] = await Promise.all([
      this.prisma.symptomEntry.count({ where }),
      this.prisma.symptomEntry.findMany({
        where,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: SymptomMapper.toResponseList(entries),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(patientId: string, symptomId: string, dto: UpdateSymptomDto) {
    await this.ensurePatientExists(patientId);

    const entry = await this.prisma.symptomEntry.findFirst({
      where: { id: symptomId, patientId },
    });

    if (!entry) {
      throw new NotFoundException(`Symptom entry "${symptomId}" not found for this patient`);
    }

    const updated = await this.prisma.symptomEntry.update({
      where: { id: symptomId },
      data: {
        ...(dto.symptomType && { symptomType: dto.symptomType }),
        ...(dto.severity && { severity: dto.severity }),
        ...(dto.occurredAt && { occurredAt: new Date(dto.occurredAt) }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
    });

    return SymptomMapper.toResponse(updated);
  }

  async remove(patientId: string, symptomId: string) {
    await this.ensurePatientExists(patientId);

    const entry = await this.prisma.symptomEntry.findFirst({
      where: { id: symptomId, patientId },
    });

    if (!entry) {
      throw new NotFoundException(`Symptom entry "${symptomId}" not found for this patient`);
    }

    await this.prisma.symptomEntry.delete({ where: { id: symptomId } });

    return { message: 'Symptom entry deleted successfully' };
  }

  // Fetches all entries for a patient and delegates insight computation
  async getInsights(patientId: string) {
    await this.ensurePatientExists(patientId);

    const entries = await this.prisma.symptomEntry.findMany({
      where: { patientId },
      orderBy: { occurredAt: 'desc' },
    });

    return this.insightsService.compute(entries);
  }

  private async ensurePatientExists(patientId: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id: patientId },
    });
    if (!patient) {
      throw new NotFoundException(`Patient with ID "${patientId}" not found`);
    }
  }
}
