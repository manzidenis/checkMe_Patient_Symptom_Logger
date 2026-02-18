import { Module } from '@nestjs/common';
import { SymptomsController } from './symptoms.controller';
import { SymptomsService } from './symptoms.service';
import { InsightsService } from './insights.service';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SymptomsController],
  providers: [SymptomsService, InsightsService],
})
export class SymptomsModule {}
