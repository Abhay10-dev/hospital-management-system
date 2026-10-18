import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { stripSecrets } from '../common/utils/secret-stripper';

export interface CreatePatientDto {
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface UpdatePatientDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  status?: string;
}

@Injectable()
export class PatientsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
  ) {}

  async findAll(search?: string) {
    const where: any = { deletedAt: null };
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { mrn: { contains: search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.patient.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const patient = await this.prisma.patient.findFirst({
      where: { id, deletedAt: null },
      include: {
        appointments: {
          where: { deletedAt: null },
          orderBy: { scheduledStart: 'desc' },
        },
      },
    });
    if (!patient) throw new NotFoundException('Patient record not found');
    return patient;
  }

  async create(dto: CreatePatientDto, userId?: string, ip?: string, ua?: string) {
    const patient = await this.prisma.patient.create({
      data: {
        mrn: dto.mrn,
        firstName: dto.firstName,
        lastName: dto.lastName,
        dateOfBirth: new Date(dto.dateOfBirth),
        gender: dto.gender,
        phone: dto.phone,
        email: dto.email,
        address: dto.address,
      },
    });

    await this.auditService.log({
      userId,
      action: 'PATIENT_CREATE',
      auditableType: 'Patient',
      auditableId: patient.id,
      newValues: stripSecrets(patient),
      ipAddress: ip,
      userAgent: ua,
    });

    return patient;
  }

  async update(id: string, dto: UpdatePatientDto, userId?: string, ip?: string, ua?: string) {
    const existing = await this.findById(id);

    const updated = await this.prisma.patient.update({
      where: { id },
      data: {
        ...dto,
        updatedAt: new Date(),
      },
    });

    await this.auditService.log({
      userId,
      action: 'PATIENT_UPDATE',
      auditableType: 'Patient',
      auditableId: id,
      oldValues: stripSecrets(existing),
      newValues: stripSecrets(updated),
      ipAddress: ip,
      userAgent: ua,
    });

    return updated;
  }

  async softDelete(id: string, userId?: string, ip?: string, ua?: string) {
    const existing = await this.findById(id);

    const deleted = await this.prisma.patient.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    await this.auditService.log({
      userId,
      action: 'PATIENT_DELETE',
      auditableType: 'Patient',
      auditableId: id,
      oldValues: stripSecrets(existing),
      newValues: { deletedAt: deleted.deletedAt },
      ipAddress: ip,
      userAgent: ua,
    });

    return { message: 'Patient record archived (soft deleted)' };
  }
}
