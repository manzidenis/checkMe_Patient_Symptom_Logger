import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../database/prisma.service';
import { GlobalExceptionFilter } from '../../common/filters/http-exception.filter';

// E2E tests for the Patient Symptom Logger API
describe('Patient Symptom Logger API (E2E)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let testPatientId: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        app.useGlobalFilters(new GlobalExceptionFilter());

        await app.init();

        prisma = app.get(PrismaService);
    });

    afterAll(async () => {
        if (testPatientId) {
            await prisma.symptomEntry.deleteMany({ where: { patientId: testPatientId } });
            await prisma.patient.delete({ where: { id: testPatientId } }).catch(() => { });
        }
        await app.close();
    });

    // Health Check
    describe('GET /health', () => {
        it('should return healthy status', () => {
            return request(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body.status).toBe('ok');
                    expect(res.body.timestamp).toBeDefined();
                });
        });
    });

    // POST /patients
    describe('POST /patients', () => {
        it('should create a patient with valid data', () => {
            return request(app.getHttpServer())
                .post('/patients')
                .send({
                    name: 'E2E Test Patient',
                    age: 30,
                    sex: 'FEMALE',
                    contact: '+250788000000',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined();
                    expect(res.body.name).toBe('E2E Test Patient');
                    expect(res.body.age).toBe(30);
                    expect(res.body.sex).toBe('FEMALE');
                    testPatientId = res.body.id;
                });
        });

        it('should return 400 for missing required fields', () => {
            return request(app.getHttpServer())
                .post('/patients')
                .send({ name: 'Incomplete' })
                .expect(400);
        });

        it('should return 400 for invalid sex value', () => {
            return request(app.getHttpServer())
                .post('/patients')
                .send({
                    name: 'Bad Sex',
                    age: 25,
                    sex: 'INVALID',
                    contact: '12345',
                })
                .expect(400);
        });

        it('should return 400 for age out of range', () => {
            return request(app.getHttpServer())
                .post('/patients')
                .send({
                    name: 'Too Old',
                    age: 200,
                    sex: 'MALE',
                    contact: '12345',
                })
                .expect(400);
        });
    });

    // GET /patients
    describe('GET /patients', () => {
        it('should return a list of patients', () => {
            return request(app.getHttpServer())
                .get('/patients')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThanOrEqual(1);
                });
        });
    });

    // GET /patients/:id
    describe('GET /patients/:id', () => {
        it('should return a patient by ID', () => {
            return request(app.getHttpServer())
                .get(`/patients/${testPatientId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(testPatientId);
                    expect(res.body.name).toBe('E2E Test Patient');
                    expect(res.body.symptomCount).toBeDefined();
                });
        });

        it('should return 404 for non-existent patient', () => {
            return request(app.getHttpServer())
                .get('/patients/00000000-0000-0000-0000-000000000000')
                .expect(404);
        });
    });

    // POST /patients/:id/symptoms
    describe('POST /patients/:id/symptoms', () => {
        it('should create a symptom entry with valid data', () => {
            return request(app.getHttpServer())
                .post(`/patients/${testPatientId}/symptoms`)
                .send({
                    symptomType: 'BREAST_PAIN',
                    severity: 3,
                    occurredAt: new Date().toISOString(),
                    notes: 'E2E test symptom',
                })
                .expect(201)
                .expect((res) => {
                    expect(res.body.id).toBeDefined();
                    expect(res.body.symptomType).toBe('BREAST_PAIN');
                    expect(res.body.severity).toBe(3);
                });
        });

        it('should return 404 for non-existent patient', () => {
            return request(app.getHttpServer())
                .post('/patients/00000000-0000-0000-0000-000000000000/symptoms')
                .send({
                    symptomType: 'FATIGUE',
                    severity: 2,
                    occurredAt: new Date().toISOString(),
                })
                .expect(404);
        });

        it('should return 400 for invalid severity', () => {
            return request(app.getHttpServer())
                .post(`/patients/${testPatientId}/symptoms`)
                .send({
                    symptomType: 'FATIGUE',
                    severity: 10,
                    occurredAt: new Date().toISOString(),
                })
                .expect(400);
        });

        it('should return 400 for invalid symptom type', () => {
            return request(app.getHttpServer())
                .post(`/patients/${testPatientId}/symptoms`)
                .send({
                    symptomType: 'HEADACHE',
                    severity: 2,
                    occurredAt: new Date().toISOString(),
                })
                .expect(400);
        });
    });

    // GET /patients/:id/symptoms
    describe('GET /patients/:id/symptoms', () => {
        it('should return paginated symptom entries', () => {
            return request(app.getHttpServer())
                .get(`/patients/${testPatientId}/symptoms`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.data).toBeDefined();
                    expect(Array.isArray(res.body.data)).toBe(true);
                    expect(res.body.meta).toBeDefined();
                    expect(res.body.meta.total).toBeGreaterThanOrEqual(1);
                    expect(res.body.meta.page).toBe(1);
                });
        });

        it('should filter by symptom type', () => {
            return request(app.getHttpServer())
                .get(`/patients/${testPatientId}/symptoms?symptomType=BREAST_PAIN`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.data)).toBe(true);
                    res.body.data.forEach((entry: any) => {
                        expect(entry.symptomType).toBe('BREAST_PAIN');
                    });
                });
        });

        it('should return 404 for non-existent patient', () => {
            return request(app.getHttpServer())
                .get('/patients/00000000-0000-0000-0000-000000000000/symptoms')
                .expect(404);
        });
    });

    // GET /patients/:id/insights
    describe('GET /patients/:id/insights', () => {
        it('should return computed insights', () => {
            return request(app.getHttpServer())
                .get(`/patients/${testPatientId}/insights`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('topSymptom');
                    expect(res.body).toHaveProperty('severityTrend');
                    expect(res.body).toHaveProperty('alert');
                    expect(res.body).toHaveProperty('totalEntries');
                    expect(typeof res.body.alert).toBe('boolean');
                });
        });

        it('should return 404 for non-existent patient', () => {
            return request(app.getHttpServer())
                .get('/patients/00000000-0000-0000-0000-000000000000/insights')
                .expect(404);
        });
    });
});