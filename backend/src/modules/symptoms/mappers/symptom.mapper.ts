import { SymptomEntry } from '@prisma/client';

export interface SymptomResponse {
    id: string;
    patientId: string;
    symptomType: string;
    severity: number;
    occurredAt: string;
    notes: string | null;
    createdAt: string;
}

// Transforms Prisma SymptomEntry entities into API response shapes
export class SymptomMapper {
    static toResponse(entry: SymptomEntry): SymptomResponse {
        return {
            id: entry.id,
            patientId: entry.patientId,
            symptomType: entry.symptomType,
            severity: entry.severity,
            occurredAt: entry.occurredAt.toISOString(),
            notes: entry.notes,
            createdAt: entry.createdAt.toISOString(),
        };
    }

    static toResponseList(entries: SymptomEntry[]): SymptomResponse[] {
        return entries.map(SymptomMapper.toResponse);
    }
}