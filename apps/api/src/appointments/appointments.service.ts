import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { stripSecrets } from '../common/utils/secret-stripper';

export interface CreateBookingRequestDto {
  patientPhone: string;
  patientName?: string;
  department: string;
  doctorId?: string;
  preferredDate: string;
  notes?: string;
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll() {
    return this.prisma.appointment.findMany({
      where: { deletedAt: null },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, phone: true } },
      },
      orderBy: { scheduledStart: 'asc' },
    });
  }

  // AI Voice Service: Check availability slots
  async getAvailability(date?: string, department?: string) {
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate.setHours(9, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(17, 0, 0, 0));

    // Return mock available clinical slots
    return {
      date: targetDate.toISOString().split('T')[0],
      department: department || 'General Medicine',
      availableSlots: [
        '09:00 - 09:30',
        '10:00 - 10:30',
        '11:30 - 12:00',
        '14:00 - 14:30',
        '15:30 - 16:00',
      ],
      timezone: 'UTC',
    };
  }

  // AI Voice Service or Receptionist: Create booking request
  async createBookingRequest(dto: CreateBookingRequestDto, userId?: string, ip?: string, ua?: string) {
    // Locate or create patient stub by phone
    let patient = await this.prisma.patient.findFirst({
      where: { phone: dto.patientPhone, deletedAt: null },
    });

    if (!patient) {
      patient = await this.prisma.patient.create({
        data: {
          mrn: `MRN-${Date.now().toString().slice(-6)}`,
          firstName: dto.patientName?.split(' ')[0] || 'Unknown',
          lastName: dto.patientName?.split(' ')[1] || 'Caller',
          dateOfBirth: new Date('1990-01-01'),
          gender: 'Unspecified',
          phone: dto.patientPhone,
        },
      });
    }

    const start = new Date(dto.preferredDate);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const appointment = await this.prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: dto.doctorId || 'doc_on_duty',
        department: dto.department,
        scheduledStart: start,
        scheduledEnd: end,
        notes: dto.notes,
        status: 'SCHEDULED',
      },
    });

    // Write BOOKING_REQUEST_CREATED audit log (Action specified in TECHSTACK.md)
    await this.auditService.log({
      userId: userId ?? null, // null for AI service external token
      action: 'BOOKING_REQUEST_CREATED',
      auditableType: 'Appointment',
      auditableId: appointment.id,
      newValues: stripSecrets({
        patientPhone: dto.patientPhone,
        department: dto.department,
        scheduledStart: appointment.scheduledStart,
        status: appointment.status,
      }),
      ipAddress: ip,
      userAgent: ua,
    });

    return appointment;
  }
}
