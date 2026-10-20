import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard, RequirePermissions } from '../rbac/rbac.guard';
import { AppointmentsService, CreateBookingRequestDto } from './appointments.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api')
export class AppointmentsController {
  constructor(@Inject(AppointmentsService) private readonly appointmentsService: AppointmentsService) {}

  @RequirePermissions('appointment:read')
  @Get('appointments')
  async findAll() {
    return this.appointmentsService.findAll();
  }

  // Contract: /api/availability (AI Scoped Token or Web User)
  @RequirePermissions('availability:read')
  @Get('availability')
  async getAvailability(
    @Query('date') date?: string,
    @Query('department') department?: string,
  ) {
    return this.appointmentsService.getAvailability(date, department);
  }

  // Contract: /api/booking-requests (AI Scoped Token or Web User)
  @RequirePermissions('booking:create')
  @Post('booking-requests')
  async createBookingRequest(
    @Body() dto: CreateBookingRequestDto,
    @CurrentUser() user: any,
    @Req() req: Request,
  ) {
    return this.appointmentsService.createBookingRequest(
      dto,
      user?.id,
      req.ip,
      req.headers['user-agent'],
    );
  }
}
