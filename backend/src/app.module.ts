import { Module } from '@nestjs/common';
import { PatientsModule } from './modules/patients/patients.module';
import { SymptomsModule } from './modules/symptoms/symptoms.module';
import { HealthModule } from './modules/health/health.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';

@Module({
  imports: [PrismaModule, AuthModule, PatientsModule, SymptomsModule, HealthModule],
})
export class AppModule { }
