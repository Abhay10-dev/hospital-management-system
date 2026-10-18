export type RoleName =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'RECEPTIONIST'
  | 'DOCTOR'
  | 'NURSE'
  | 'AI_SERVICE';

export type PermissionAction =
  | 'availability:read'
  | 'booking:create'
  | 'patient:read'
  | 'patient:create'
  | 'patient:update'
  | 'patient:delete'
  | 'appointment:read'
  | 'appointment:create'
  | 'appointment:update'
  | 'appointment:cancel'
  | 'audit:read'
  | 'user:manage'
  | 'report:read';

export interface UserSession {
  id: string;
  email: string;
  fullName: string;
  role: RoleName;
  permissions: PermissionAction[];
}

export interface AuditLogItem {
  id: string;
  userId: string | null;
  userName?: string;
  userRole?: string;
  action: string;
  auditableType: string;
  auditableId: string;
  oldValues: Record<string, unknown> | null;
  newValues: Record<string, unknown> | null;
  ipAddress: string | null;
  userAgent: string | null;
  performedAt: string;
}

export interface PatientRecord {
  id: string;
  mrn: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  status: 'ACTIVE' | 'INACTIVE';
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName?: string;
  department: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  notes?: string | null;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RoleDefinition {
  id: number;
  name: RoleName;
  description: string;
  permissions: PermissionAction[];
}

export const ROLE_PERMISSIONS: Record<RoleName, PermissionAction[]> = {
  SUPER_ADMIN: [
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
  ],
  ADMIN: [
    'patient:read',
    'patient:create',
    'patient:update',
    'appointment:read',
    'appointment:create',
    'appointment:update',
    'report:read',
    'user:manage',
  ],
  RECEPTIONIST: [
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
  DOCTOR: ['patient:read', 'appointment:read', 'appointment:update'],
  NURSE: ['patient:read', 'appointment:read', 'appointment:update'],
  AI_SERVICE: ['availability:read', 'booking:create'],
};

export function hasPermission(role: RoleName, action: PermissionAction): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms ? perms.includes(action) : false;
}
