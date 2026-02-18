import { PrismaClient, SymptomType, Sex, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    await prisma.user.deleteMany();
    await prisma.symptomEntry.deleteMany();
    await prisma.patient.deleteMany();

    const now = new Date();
    const daysAgo = (days: number): Date => {
        const d = new Date(now);
        d.setDate(d.getDate() - days);
        return d;
    };

    const symptomTypes = Object.values(SymptomType);

    // Patients 
    const patients = await Promise.all([
        prisma.patient.create({ data: { firstName: 'Jane', lastName: 'Doe', middleName: 'Marie', dateOfBirth: new Date('1984-03-15'), sex: Sex.FEMALE, phone: '+250788123456', email: 'jane@example.com', country: 'Rwanda', city: 'Kigali' } }),
        prisma.patient.create({ data: { firstName: 'John', lastName: 'Smith', dateOfBirth: new Date('1971-08-22'), sex: Sex.MALE, phone: '+250722111222', email: 'john.smith@email.com', country: 'Rwanda', city: 'Butare' } }),
        prisma.patient.create({ data: { firstName: 'Alice', lastName: 'Uwimana', dateOfBirth: new Date('1997-06-10'), sex: Sex.FEMALE, phone: '+250722987654', country: 'Rwanda', city: 'Gisenyi' } }),
        prisma.patient.create({ data: { firstName: 'Emmanuel', lastName: 'Nkurunziza', middleName: 'Pierre', dateOfBirth: new Date('1965-12-01'), sex: Sex.MALE, phone: '+250788555123', email: 'emmanuel.n@mail.com', country: 'Burundi', city: 'Bujumbura' } }),
        prisma.patient.create({ data: { firstName: 'Grace', lastName: 'Mutoni', dateOfBirth: new Date('1992-04-18'), sex: Sex.FEMALE, phone: '+250788444321', email: 'grace.m@mail.com', country: 'Rwanda', city: 'Kigali' } }),
        prisma.patient.create({ data: { firstName: 'David', lastName: 'Mugisha', dateOfBirth: new Date('1988-09-30'), sex: Sex.MALE, phone: '+250733111222', country: 'Uganda', city: 'Kampala' } }),
        prisma.patient.create({ data: { firstName: 'Esther', lastName: 'Kemigisha', middleName: 'Joy', dateOfBirth: new Date('2000-01-25'), sex: Sex.FEMALE, phone: '+250788999888', email: 'esther.k@mail.com', country: 'Uganda', city: 'Mbarara' } }),
        prisma.patient.create({ data: { firstName: 'Patrick', lastName: 'Habimana', dateOfBirth: new Date('1976-07-14'), sex: Sex.MALE, phone: '+250722333444', country: 'Rwanda', city: 'Musanze' } }),
        prisma.patient.create({ data: { firstName: 'Christine', lastName: 'Iradukunda', dateOfBirth: new Date('1995-11-03'), sex: Sex.FEMALE, phone: '+250788222111', email: 'chris.i@mail.com', country: 'Rwanda', city: 'Huye' } }),
        prisma.patient.create({ data: { firstName: 'Jean', lastName: 'Ndayisaba', middleName: 'Claude', dateOfBirth: new Date('1960-05-20'), sex: Sex.MALE, phone: '+250788666777', country: 'Rwanda', city: 'Kigali' } }),
        prisma.patient.create({ data: { firstName: 'Diane', lastName: 'Nyiraneza', dateOfBirth: new Date('1990-02-14'), sex: Sex.FEMALE, phone: '+250733555666', email: 'diane.n@mail.com', country: 'Rwanda', city: 'Rubavu' } }),
        prisma.patient.create({ data: { firstName: 'Samuel', lastName: 'Bizimana', dateOfBirth: new Date('1982-10-08'), sex: Sex.MALE, phone: '+250788777888', country: 'Burundi', city: 'Gitega' } }),
        prisma.patient.create({ data: { firstName: 'Claudine', lastName: 'Mukamana', middleName: 'Anne', dateOfBirth: new Date('1999-08-19'), sex: Sex.FEMALE, phone: '+250722444555', email: 'claudine.m@mail.com', country: 'Rwanda', city: 'Kigali' } }),
        prisma.patient.create({ data: { firstName: 'Robert', lastName: 'Kamanzi', dateOfBirth: new Date('1975-03-28'), sex: Sex.MALE, phone: '+250788111333', country: 'Rwanda', city: 'Nyagatare' } }),
        prisma.patient.create({ data: { firstName: 'Marie', lastName: 'Ingabire', dateOfBirth: new Date('2001-12-05'), sex: Sex.FEMALE, phone: '+250733222111', email: 'marie.i@mail.com', country: 'DRC', city: 'Goma' } }),
        prisma.patient.create({ data: { firstName: 'Eric', lastName: 'Tuyishime', middleName: 'James', dateOfBirth: new Date('1993-06-22'), sex: Sex.MALE, phone: '+250788333444', country: 'Rwanda', city: 'Kigali' } }),
        prisma.patient.create({ data: { firstName: 'Josephine', lastName: 'Uwase', dateOfBirth: new Date('1987-01-11'), sex: Sex.FEMALE, phone: '+250722888999', email: 'josephine.u@mail.com', country: 'Rwanda', city: 'Butare' } }),
        prisma.patient.create({ data: { firstName: 'François', lastName: 'Bizimungu', dateOfBirth: new Date('1968-09-15'), sex: Sex.MALE, phone: '+250788555666', country: 'Rwanda', city: 'Muhanga' } }),
    ]);

    const [jane, john, alice, emmanuel, grace, david, esther, patrick, christine, jean, diane, samuel, claudine, robert, marie, eric, josephine, francois] = patients;

    //  Symptom Entries 
    await prisma.symptomEntry.createMany({
        data: [
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(1), notes: 'Intense pain in left breast' },
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(2), notes: 'Pain worsening, radiating to arm' },
            { patientId: jane.id, symptomType: SymptomType.LUMP_DETECTED, severity: 4, occurredAt: daysAgo(3), notes: 'Lump detected during self-exam' },
            { patientId: jane.id, symptomType: SymptomType.SWELLING, severity: 4, occurredAt: daysAgo(5) },
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(8) },
            { patientId: jane.id, symptomType: SymptomType.FATIGUE, severity: 3, occurredAt: daysAgo(10), notes: 'Persistent tiredness' },
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(12) },
            { patientId: jane.id, symptomType: SymptomType.SKIN_CHANGES, severity: 2, occurredAt: daysAgo(15), notes: 'Minor skin discoloration' },
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(18) },
            { patientId: jane.id, symptomType: SymptomType.NIPPLE_DISCHARGE, severity: 2, occurredAt: daysAgo(22), notes: 'Clear discharge noticed' },
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(25) },
            { patientId: jane.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(28) },
            { patientId: jane.id, symptomType: SymptomType.SWELLING, severity: 1, occurredAt: daysAgo(30) },
            { patientId: jane.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(35) },
            { patientId: jane.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(40), notes: 'Mild discomfort when sleeping on left side' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: john.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(2), notes: 'Mild fatigue after exercise' },
            { patientId: john.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(5) },
            { patientId: john.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(9) },
            { patientId: john.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(12), notes: 'Moderate tiredness' },
            { patientId: john.id, symptomType: SymptomType.OTHER, severity: 2, occurredAt: daysAgo(16), notes: 'General discomfort in chest area' },
            { patientId: john.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(20) },
            { patientId: john.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(25) },
            { patientId: john.id, symptomType: SymptomType.FATIGUE, severity: 3, occurredAt: daysAgo(30), notes: 'Fatigue persistent last week' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(1), notes: 'Almost pain-free today' },
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(3) },
            { patientId: emmanuel.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(6), notes: 'Mild fatigue, feeling better' },
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(9) },
            { patientId: emmanuel.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(12) },
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(15) },
            { patientId: emmanuel.id, symptomType: SymptomType.LUMP_DETECTED, severity: 3, occurredAt: daysAgo(18), notes: 'Lump seems smaller than before' },
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(22) },
            { patientId: emmanuel.id, symptomType: SymptomType.FATIGUE, severity: 4, occurredAt: daysAgo(26) },
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(30) },
            { patientId: emmanuel.id, symptomType: SymptomType.SKIN_CHANGES, severity: 5, occurredAt: daysAgo(35), notes: 'Significant skin changes at start' },
            { patientId: emmanuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(40) },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: grace.id, symptomType: SymptomType.LUMP_DETECTED, severity: 4, occurredAt: daysAgo(1), notes: 'Lump growing in size' },
            { patientId: grace.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(2) },
            { patientId: grace.id, symptomType: SymptomType.NIPPLE_DISCHARGE, severity: 3, occurredAt: daysAgo(4), notes: 'Bloody discharge' },
            { patientId: grace.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(7) },
            { patientId: grace.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(10) },
            { patientId: grace.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(14), notes: 'Increasing fatigue' },
            { patientId: grace.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(18) },
            { patientId: grace.id, symptomType: SymptomType.LUMP_DETECTED, severity: 2, occurredAt: daysAgo(22), notes: 'Lump was smaller initially' },
            { patientId: grace.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(28) },
            { patientId: grace.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(32) },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: david.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(3), notes: 'Mild fatigue' },
            { patientId: david.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(8) },
            { patientId: david.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(14) },
            { patientId: david.id, symptomType: SymptomType.SWELLING, severity: 1, occurredAt: daysAgo(20) },
            { patientId: david.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(26) },
            { patientId: david.id, symptomType: SymptomType.OTHER, severity: 2, occurredAt: daysAgo(32), notes: 'Minor chest discomfort' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: esther.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(2), notes: 'Pain almost gone' },
            { patientId: esther.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(5) },
            { patientId: esther.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(9) },
            { patientId: esther.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(13) },
            { patientId: esther.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(17) },
            { patientId: esther.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(21), notes: 'Sharp pain' },
            { patientId: esther.id, symptomType: SymptomType.SKIN_CHANGES, severity: 4, occurredAt: daysAgo(25), notes: 'Redness around nipple' },
            { patientId: esther.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(30) },
            { patientId: esther.id, symptomType: SymptomType.LUMP_DETECTED, severity: 4, occurredAt: daysAgo(35), notes: 'Lump first detected' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: patrick.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(5), notes: 'Dull ache' },
            { patientId: patrick.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(12) },
            { patientId: patrick.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(20) },
            { patientId: patrick.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(28) },
            { patientId: patrick.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(35), notes: 'Brief discomfort' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: christine.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(1), notes: 'Severe pain' },
            { patientId: christine.id, symptomType: SymptomType.LUMP_DETECTED, severity: 5, occurredAt: daysAgo(2), notes: 'Lump is hard and fixed' },
            { patientId: christine.id, symptomType: SymptomType.NIPPLE_DISCHARGE, severity: 4, occurredAt: daysAgo(4) },
            { patientId: christine.id, symptomType: SymptomType.SKIN_CHANGES, severity: 4, occurredAt: daysAgo(6), notes: 'Puckering of skin' },
            { patientId: christine.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(9) },
            { patientId: christine.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(12) },
            { patientId: christine.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(16) },
            { patientId: christine.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(20), notes: 'Tiredness increasing' },
            { patientId: christine.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(25) },
            { patientId: christine.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(30) },
            { patientId: christine.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(35), notes: 'Mild back pain' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: jean.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(3) },
            { patientId: jean.id, symptomType: SymptomType.FATIGUE, severity: 3, occurredAt: daysAgo(7) },
            { patientId: jean.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(12), notes: 'Dull aching pain' },
            { patientId: jean.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(17) },
            { patientId: jean.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(22) },
            { patientId: jean.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(28) },
            { patientId: jean.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(33) },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: diane.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(2) },
            { patientId: diane.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(6) },
            { patientId: diane.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(10), notes: 'Mild pain' },
            { patientId: diane.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(15) },
            { patientId: diane.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(20) },
            { patientId: diane.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(25), notes: 'Significant pain two weeks ago' },
            { patientId: diane.id, symptomType: SymptomType.SKIN_CHANGES, severity: 4, occurredAt: daysAgo(30) },
            { patientId: diane.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(35), notes: 'Initial severe pain' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: samuel.id, symptomType: SymptomType.FATIGUE, severity: 3, occurredAt: daysAgo(4), notes: 'Moderate fatigue' },
            { patientId: samuel.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(14) },
            { patientId: samuel.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(25) },
            { patientId: samuel.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(36), notes: 'Minor ache' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: claudine.id, symptomType: SymptomType.LUMP_DETECTED, severity: 5, occurredAt: daysAgo(1), notes: 'Lump doubled in size' },
            { patientId: claudine.id, symptomType: SymptomType.BREAST_PAIN, severity: 5, occurredAt: daysAgo(2) },
            { patientId: claudine.id, symptomType: SymptomType.NIPPLE_DISCHARGE, severity: 4, occurredAt: daysAgo(3), notes: 'Bloody nipple discharge' },
            { patientId: claudine.id, symptomType: SymptomType.SKIN_CHANGES, severity: 4, occurredAt: daysAgo(5) },
            { patientId: claudine.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(7) },
            { patientId: claudine.id, symptomType: SymptomType.FATIGUE, severity: 3, occurredAt: daysAgo(10) },
            { patientId: claudine.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(13) },
            { patientId: claudine.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(17) },
            { patientId: claudine.id, symptomType: SymptomType.LUMP_DETECTED, severity: 2, occurredAt: daysAgo(21), notes: 'Lump was small initially' },
            { patientId: claudine.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(25) },
            { patientId: claudine.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(30) },
            { patientId: claudine.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(35) },
            { patientId: claudine.id, symptomType: SymptomType.BREAST_PAIN, severity: 1, occurredAt: daysAgo(40) },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: robert.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(4) },
            { patientId: robert.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(10), notes: 'Consistent dull pain' },
            { patientId: robert.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(16) },
            { patientId: robert.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(22) },
            { patientId: robert.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(28) },
            { patientId: robert.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(34) },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: marie.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(1), notes: 'Sharp stabbing pain' },
            { patientId: marie.id, symptomType: SymptomType.LUMP_DETECTED, severity: 4, occurredAt: daysAgo(3) },
            { patientId: marie.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(7) },
            { patientId: marie.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(12) },
            { patientId: marie.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(18) },
            { patientId: marie.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(24) },
            { patientId: marie.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(30), notes: 'Occasional discomfort' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: eric.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(2) },
            { patientId: eric.id, symptomType: SymptomType.FATIGUE, severity: 2, occurredAt: daysAgo(5) },
            { patientId: eric.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(9), notes: 'Recurring pain' },
            { patientId: eric.id, symptomType: SymptomType.SWELLING, severity: 2, occurredAt: daysAgo(13) },
            { patientId: eric.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(17) },
            { patientId: eric.id, symptomType: SymptomType.FATIGUE, severity: 3, occurredAt: daysAgo(22) },
            { patientId: eric.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(27) },
            { patientId: eric.id, symptomType: SymptomType.SKIN_CHANGES, severity: 2, occurredAt: daysAgo(32) },
            { patientId: eric.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(38) },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: josephine.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(3), notes: 'Feeling much better' },
            { patientId: josephine.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(8) },
            { patientId: josephine.id, symptomType: SymptomType.BREAST_PAIN, severity: 3, occurredAt: daysAgo(14), notes: 'Moderate pain' },
            { patientId: josephine.id, symptomType: SymptomType.SWELLING, severity: 3, occurredAt: daysAgo(20) },
            { patientId: josephine.id, symptomType: SymptomType.BREAST_PAIN, severity: 4, occurredAt: daysAgo(26) },
            { patientId: josephine.id, symptomType: SymptomType.FATIGUE, severity: 4, occurredAt: daysAgo(32), notes: 'Bad fatigue initially' },
        ],
    });

    await prisma.symptomEntry.createMany({
        data: [
            { patientId: francois.id, symptomType: SymptomType.BREAST_PAIN, severity: 2, occurredAt: daysAgo(7), notes: 'First visit' },
            { patientId: francois.id, symptomType: SymptomType.FATIGUE, severity: 1, occurredAt: daysAgo(14) },
            { patientId: francois.id, symptomType: SymptomType.OTHER, severity: 1, occurredAt: daysAgo(21), notes: 'General checkup symptom' },
        ],
    });

    await prisma.user.create({
        data: { email: 'clinician@checkme.rw', password: 'clinician123', role: Role.CLINICIAN },
    });

    await prisma.user.create({
        data: { email: 'jane@patient.rw', password: 'jane123', role: Role.PATIENT, patientId: jane.id },
    });

    await prisma.user.create({
        data: { email: 'john@patient.rw', password: 'john123', role: Role.PATIENT, patientId: john.id },
    });

    console.log(`Seeded ${patients.length} patients with symptom data + 3 users:`);
    console.log(`  Clinician: clinician@checkme.rw / clinician123`);
    console.log(`  Patient:   jane@patient.rw / jane123 (ID: ${jane.id})`);
    console.log(`  Patient:   john@patient.rw / john123 (ID: ${john.id})`);
    console.log(`  Patient:   Alice Uwimana (ID: ${alice.id}) — no symptoms (edge case)`);
    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });