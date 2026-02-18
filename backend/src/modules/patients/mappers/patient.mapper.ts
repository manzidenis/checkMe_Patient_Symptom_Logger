import { Patient } from '@prisma/client';

export interface PatientResponse {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    fullName: string;
    dateOfBirth: string;
    age: number;
    sex: string;
    phone: string;
    email: string | null;
    country: string;
    city: string;
    createdAt: string;
    updatedAt: string;
}

export interface PatientWithCountResponse extends PatientResponse {
    symptomCount: number;
}

function computeAge(dateOfBirth: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
        age--;
    }
    return age;
}

function buildFullName(first: string, last: string, middle?: string | null): string {
    return middle ? `${first} ${middle} ${last}` : `${first} ${last}`;
}

// Transforms Prisma Patient entities into API response shapes
export class PatientMapper {
    static toResponse(patient: Patient): PatientResponse {
        return {
            id: patient.id,
            firstName: patient.firstName,
            lastName: patient.lastName,
            middleName: patient.middleName,
            fullName: buildFullName(patient.firstName, patient.lastName, patient.middleName),
            dateOfBirth: patient.dateOfBirth.toISOString().split('T')[0],
            age: computeAge(patient.dateOfBirth),
            sex: patient.sex,
            phone: patient.phone,
            email: patient.email,
            country: patient.country,
            city: patient.city,
            createdAt: patient.createdAt.toISOString(),
            updatedAt: patient.updatedAt.toISOString(),
        };
    }

    static toResponseWithCount(
        patient: Patient & { _count?: { symptoms: number } },
    ): PatientWithCountResponse {
        return {
            ...PatientMapper.toResponse(patient),
            symptomCount: patient._count?.symptoms ?? 0,
        };
    }
}