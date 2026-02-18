import { Controller, Post, Get, Patch, Delete, Param, Body, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { FilterPatientDto } from './dto/filter-patient.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { OwnershipGuard } from '../../common/guards/ownership.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Patients')
@ApiBearerAuth()
@Controller('patients')
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly service: PatientsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(RolesGuard)
  @Roles('CLINICIAN')
  @ApiOperation({ summary: 'Register a new patient (clinician only)' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  create(@Body() dto: CreatePatientDto) {
    return this.service.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('CLINICIAN')
  @ApiOperation({ summary: 'List patients with pagination, sorting, and filtering (clinician only)' })
  @ApiResponse({ status: 200, description: 'Paginated patients with symptom counts' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  findAll(@Query() filters: FilterPatientDto) {
    return this.service.findAll(filters);
  }

  @Get(':id')
  @UseGuards(RolesGuard, OwnershipGuard)
  @Roles('CLINICIAN', 'PATIENT')
  @ApiOperation({ summary: 'Get a single patient by ID' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiResponse({ status: 200, description: 'Returns the patient details' })
  @ApiResponse({ status: 403, description: 'Cannot access another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard, OwnershipGuard)
  @Roles('CLINICIAN', 'PATIENT')
  @ApiOperation({ summary: 'Update patient details' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiResponse({ status: 200, description: 'Patient updated successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 403, description: 'Cannot update another patient\'s data' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  update(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('CLINICIAN')
  @ApiOperation({ summary: 'Delete a patient and all associated data (clinician only)' })
  @ApiParam({ name: 'id', description: 'UUID of the patient' })
  @ApiResponse({ status: 200, description: 'Patient deleted successfully' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'Patient not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
