import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { PatientMapper } from './mappers/patient.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreatePatientDto) {
    const patient = await this.prisma.patient.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        middleName: dto.middleName,
        dateOfBirth: new Date(dto.dateOfBirth),
        sex: dto.sex,
        phone: dto.phone,
        email: dto.email,
        country: dto.country,
        city: dto.city,
      },
    });
    return PatientMapper.toResponse(patient);
  }

  async findAll(filters: FilterPatientDto) {
    const where: Prisma.PatientWhereInput = {};

    if (filters.search) {
      const q = filters.search;
      where.OR = [
        { firstName: { contains: q, mode: 'insensitive' } },
        { lastName: { contains: q, mode: 'insensitive' } },
        { middleName: { contains: q, mode: 'insensitive' } },
        { phone: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
        { country: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (filters.sex) where.sex = filters.sex;
    if (filters.country) where.country = { contains: filters.country, mode: 'insensitive' };
    if (filters.city) where.city = { contains: filters.city, mode: 'insensitive' };

    const allowedSortFields = ['firstName', 'lastName', 'dateOfBirth', 'createdAt', 'city', 'country', 'symptomCount'];
    const sortBy = allowedSortFields.includes(filters.sortBy ?? '') ? filters.sortBy! : 'createdAt';
    const sortOrder = filters.sortOrder === 'asc' ? 'asc' : 'desc';

    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;
    const skip = (page - 1) * limit;

    // symptomCount requires special Prisma orderBy syntax
    const orderBy = sortBy === 'symptomCount'
      ? { symptoms: { _count: sortOrder as 'asc' | 'desc' } }
      : { [sortBy]: sortOrder };

    const [total, patients] = await Promise.all([
      this.prisma.patient.count({ where }),
      this.prisma.patient.findMany({
        where,
        orderBy,
        include: { _count: { select: { symptoms: true } } },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: patients.map(PatientMapper.toResponseWithCount),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: { _count: { select: { symptoms: true } } },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${id}" not found`);
    }

    return PatientMapper.toResponseWithCount(patient);
  }

  async update(id: string, dto: UpdatePatientDto) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${id}" not found`);
    }

    const updated = await this.prisma.patient.update({
      where: { id },
      data: {
        ...(dto.firstName && { firstName: dto.firstName }),
        ...(dto.lastName && { lastName: dto.lastName }),
        ...(dto.middleName !== undefined && { middleName: dto.middleName }),
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.sex && { sex: dto.sex }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.email !== undefined && { email: dto.email }),
        ...(dto.country && { country: dto.country }),
        ...(dto.city && { city: dto.city }),
      },
    });

    return PatientMapper.toResponse(updated);
  }

  async remove(id: string) {
    const patient = await this.prisma.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${id}" not found`);
    }

    await this.prisma.user.deleteMany({ where: { patientId: id } });
    await this.prisma.symptomEntry.deleteMany({ where: { patientId: id } });
    await this.prisma.patient.delete({ where: { id } });

    return { message: 'Patient deleted successfully' };
  }
}
