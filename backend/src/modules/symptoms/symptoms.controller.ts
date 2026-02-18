import { Controller, Post, Get, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { SymptomsService } from './symptoms.service';
import { CreateSymptomDto } from './dto/create-symptom.dto';
import { UpdateSymptomDto } from './dto/update-symptom.dto';
import { FilterSymptomDto } from './dto/filter-symptom.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Symptoms')
@ApiBearerAuth()
@Controller('patients/:id')
@UseGuards(JwtAuthGuard, RolesGuard, OwnershipGuard)
@Roles('CLINICIAN', 'PATIENT')
export class SymptomsController {
  constructor(private readonly service: SymptomsService) { }

  @Post('symptoms')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Log a symptom entry for a patient' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiResponse({ status: 201, description: 'Symptom entry created' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Cannot access another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  create(@Param('id') id: string, @Body() dto: CreateSymptomDto) {
    return this.service.create(id, dto);
  }

  @Get('symptoms')
  @ApiOperation({ summary: 'Get symptom history with optional filters' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiResponse({ status: 200, description: 'Paginated symptom entries' })
  @ApiResponse({ status: 403, description: 'Cannot access another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  findAll(@Param('id') id: string, @Query() filters: FilterSymptomDto) {
    return this.service.findAll(id, filters);
  }

  @Patch('symptoms/:symptomId')
  @ApiOperation({ summary: 'Update a symptom entry' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiParam({ name: 'symptomId', description: 'UUID of the symptom entry' })
  @ApiResponse({ status: 200, description: 'Symptom entry updated' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Cannot access another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Symptom entry not found' })
  update(@Param('id') id: string, @Param('symptomId') symptomId: string, @Body() dto: UpdateSymptomDto) {
    return this.service.update(id, symptomId, dto);
  }

  @Delete('symptoms/:symptomId')
  @ApiOperation({ summary: 'Delete a symptom entry' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiParam({ name: 'symptomId', description: 'UUID of the symptom entry' })
  @ApiResponse({ status: 200, description: 'Symptom entry deleted' })
  @ApiResponse({ status: 403, description: 'Cannot access another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Symptom entry not found' })
  remove(@Param('id') id: string, @Param('symptomId') symptomId: string) {
    return this.service.remove(id, symptomId);
  }

  @Get('insights')
  @ApiOperation({ summary: 'Get computed insights and alerts for a patient' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiResponse({ status: 200, description: 'Computed insights' })
  @ApiResponse({ status: 403, description: 'Cannot access another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  insights(@Param('id') id: string) {
    return this.service.getInsights(id);
  }
}
