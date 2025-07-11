import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CreateDoctorDto, SubmitRatingDto, UpdateDoctorDto } from '../dtos/index'
import { SetAvailabilityDto } from '../dtos/set-availability.dto'
import { Doctor } from '../schemas/doctor.schema'
import { UsersService } from '../user.service'
@ApiTags('doctors')
@Controller('api/v1/doctors')
export class DoctorController {
  constructor(private readonly usersService: UsersService) {}
  @ApiOperation({ summary: 'Search doctors' })
  @ApiResponse({ status: 200, description: 'Return matching doctors with pagination.' })
  @ApiQuery({ name: 'query', required: false, description: 'Search term' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'sortField', required: false, example: 'createdAt' })
  @ApiQuery({ name: 'sortOrder', enum: ['asc', 'desc'], required: false, example: 'desc' })
  @Get('search')
  async searchDoctors(
    @Query('query') query: string = '',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('sortField') sortField: string = 'createdAt',
    @Query('sortOrder') sortOrder: 'asc' | 'desc' = 'desc',
  ) {
    return await this.usersService.searchDoctors(query, page, limit, sortField, sortOrder)
  }

  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'Return all doctors.' })
  @Get()
  findAllDoctors() {
    return this.usersService.getAllDoctors()
  }

  @ApiOperation({ summary: 'Migrate default registration status' })
  @ApiResponse({ status: 200, description: 'Registration status migrated successfully.' })
  @Get('migrate-registration-status')
  migrateRegistrationStatus() {
    return this.usersService.migrateDefaultRegistrationStatus()
  }

  @ApiOperation({ summary: 'Get a doctor by MongoDB _id' })
  @ApiResponse({ status: 200, description: 'Return a doctor.' })
  @ApiResponse({ status: 404, description: 'Doctor not found.' })
  @ApiParam({ name: '_id', description: 'Doctor MongoDB _id' })
  @Get(':_id')
  findDoctorById(@Param('_id') id: string): Promise<Doctor> {
    return this.usersService.getDoctorById(id)
  }

  @ApiOperation({ summary: 'Create a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor created successfully.' })
  @ApiBody({ type: CreateDoctorDto })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.usersService.createDoctor(createDoctorDto)
  }

  @ApiOperation({ summary: 'Update an existing doctor by _id' })
  @ApiResponse({ status: 200, description: 'Doctor updated successfully.' })
  @ApiParam({ name: '_id', description: 'Doctor MongoDB _id' })
  @ApiBody({ type: UpdateDoctorDto })
  @Put(':_id')
  updateDoctor(@Param('_id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.usersService.updateDoctor(id, updateDoctorDto)
  }

  @ApiOperation({ summary: 'Delete a doctor by _id' })
  @ApiResponse({ status: 204, description: 'Doctor deleted successfully.' })
  @ApiParam({ name: '_id', description: 'Doctor MongoDB _id' })
  @Delete(':_id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteDoctor(@Param('_id') id: string) {
    return this.usersService.deleteDoctor(id)
  }

  @Patch(':_id/rating')
  @ApiOperation({ summary: 'Bệnh nhân đánh giá bác sĩ sau cuộc hẹn' })
  submitRating(
    @Param('_id') id: string,
    @Body() dto: SubmitRatingDto,
  ): Promise<{ message: string }> {
    console.log('dto', dto)
    return this.usersService.submitDoctorRating(id, dto)
  }

  @Patch(':_id/set-availability')
  @ApiOperation({ summary: 'Bác sĩ cập nhật lịch làm việc trong tuần' })
  @ApiBody({ type: SetAvailabilityDto })
  @ApiResponse({
    status: 200,
    description: 'Cập nhật lịch làm việc thành công',
    type: Doctor,
  })
  async setAvailability(
    @Param('_id') id: string,
    @Body() dto: SetAvailabilityDto,
  ): Promise<Doctor> {
    return this.usersService.setDoctorAvailability(id, dto)
  }

  @Get(':_id/availability')
  @ApiOperation({ summary: 'Lấy lịch làm việc của bác sĩ' })
  @ApiResponse({
    status: 200,
    description: 'Trả về lịch làm việc của bác sĩ',
    type: Doctor,
  })
  async getAvailability(@Param('_id') id: string): Promise<Doctor> {
    return this.usersService.getDoctorById(id)
  }

  @ApiOperation({ summary: 'Cập nhật thông tin ngân hàng cho doctor' })
  @ApiParam({ name: '_id', description: 'Doctor MongoDB _id' })
  @Post(':_id/bank')
  async updateBank(
    @Param('_id') id: string,
    @Body('bank')
    bank: {
      accountNumber?: string
      bankName?: string
      branch?: string
      accountHolder?: string
      phoneNumber?: string
    },
  ) {
    return this.usersService.updateBankInfo(id, bank)
  }
}
