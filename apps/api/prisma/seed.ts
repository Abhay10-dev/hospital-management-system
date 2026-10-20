import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Permissions
  const permissionsList = [
    'availability:read',
    'booking:create',
    'patient:read',
    'patient:create',
    'patient:update',
    'patient:delete',
    'appointment:read',
    'appointment:create',
    'appointment:update',
    'appointment:cancel',
    'audit:read',
    'user:manage',
    'report:read',
  ];

  const permissionsMap = new Map<string, number>();
  for (const action of permissionsList) {
    const perm = await prisma.permission.upsert({
      where: { action },
      update: {},
      create: { action },
    });
    permissionsMap.set(action, perm.id);
  }

  // 2. Roles
  const rolesData: { name: string; permissions: string[] }[] = [
    {
      name: 'SUPER_ADMIN',
      permissions: permissionsList, // full access
    },
    {
      name: 'ADMIN',
      permissions: [
        'patient:read',
        'patient:create',
        'patient:update',
        'appointment:read',
        'appointment:create',
        'appointment:update',
        'report:read',
        'user:manage',
      ],
    },
    {
      name: 'RECEPTIONIST',
      permissions: [
        'patient:read',
        'patient:create',
        'patient:update',
        'appointment:read',
        'appointment:create',
        'appointment:update',
        'appointment:cancel',
        'availability:read',
        'booking:create',
      ],
    },
    {
      name: 'DOCTOR',
      permissions: ['patient:read', 'appointment:read', 'appointment:update'],
    },
    {
      name: 'NURSE',
      permissions: ['patient:read', 'appointment:read', 'appointment:update'],
    },
    {
      name: 'AI_SERVICE',
      permissions: ['availability:read', 'booking:create'], // strictly scoped!
    },
  ];

  const rolesMap = new Map<string, number>();
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name },
    });
    rolesMap.set(r.name, role.id);

    // Link permissions
    for (const permAction of r.permissions) {
      const permId = permissionsMap.get(permAction);
      if (permId) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: role.id,
              permissionId: permId,
            },
          },
          update: {},
          create: {
            roleId: role.id,
            permissionId: permId,
          },
        });
      }
    }
  }

  // 3. Seed Users
  const pepper = process.env.ARGON2_PEPPER || '';
  const defaultPassword = await argon2.hash('SuperSecret123#' + pepper, {
    type: argon2.argon2id,
    memoryCost: 65536,
    timeCost: 3,
    parallelism: 4,
  });

  const users = [
    {
      email: 'superadmin@hospital.com',
      fullName: 'Dr. Arthur Vance',
      role: 'SUPER_ADMIN',
    },
    {
      email: 'admin@hospital.com',
      fullName: 'Clara Oswald',
      role: 'ADMIN',
    },
    {
      email: 'reception@hospital.com',
      fullName: 'Emily Thorne',
      role: 'RECEPTIONIST',
    },
    {
      email: 'doctor@hospital.com',
      fullName: 'Dr. Sarah Jenkins',
      role: 'DOCTOR',
    },
    {
      email: 'nurse@hospital.com',
      fullName: 'Nurse Joy',
      role: 'NURSE',
    },
  ];

  for (const u of users) {
    const roleId = rolesMap.get(u.role);
    if (!roleId) continue;
    await prisma.user.upsert({
      where: { email: u.email },
      update: { roleId, fullName: u.fullName },
      create: {
        email: u.email,
        fullName: u.fullName,
        passwordHash: defaultPassword,
        roleId,
        isActive: true,
      },
    });
  }

  // 4. Initial Fictional Patients
  const patient1 = await prisma.patient.upsert({
    where: { mrn: 'MRN-2026-0042' },
    update: {},
    create: {
      mrn: 'MRN-2026-0042',
      firstName: 'Eleanor',
      lastName: 'Pond',
      dateOfBirth: new Date('1989-05-12'),
      gender: 'Female',
      phone: '+1-555-0144',
      email: 'eleanor.p@example.com',
      status: 'ACTIVE',
    },
  });

  const patient2 = await prisma.patient.upsert({
    where: { mrn: 'MRN-2026-0089' },
    update: {},
    create: {
      mrn: 'MRN-2026-0089',
      firstName: 'Marcus',
      lastName: 'Vance',
      dateOfBirth: new Date('1975-11-23'),
      gender: 'Male',
      phone: '+1-555-0199',
      email: 'marcus.v@example.com',
      status: 'ACTIVE',
    },
  });

  // 5. Initial Fictional Appointment (idempotent)
  const existingAppointment = await prisma.appointment.findFirst({
    where: {
      patientId: patient1.id,
      department: 'Cardiology',
    },
  });
  if (!existingAppointment) {
    await prisma.appointment.create({
      data: {
        patientId: patient1.id,
        doctorId: 'doc_sarah_jenkins',
        department: 'Cardiology',
        scheduledStart: new Date(Date.now() + 24 * 3600 * 1000),
        scheduledEnd: new Date(Date.now() + 24 * 3600 * 1000 + 30 * 60 * 1000),
        status: 'CONFIRMED',
        notes: 'Initial cardiac stress assessment',
      },
    });
  }

  // 6. Initial Audit Log (idempotent)
  const existingAuditLog = await prisma.auditLog.findFirst({
    where: {
      auditableId: 'initial_seed',
    },
  });
  if (!existingAuditLog) {
    await prisma.auditLog.create({
      data: {
        action: 'SYSTEM_SEED',
        auditableType: 'System',
        auditableId: 'initial_seed',
        newValues: { message: 'Seed data successfully loaded with privacy safeguards' },
        performedAt: new Date(),
      },
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
