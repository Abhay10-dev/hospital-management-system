import { stripSecrets } from '../src/common/utils/secret-stripper';
import * as argon2 from 'argon2';
import { RolesGuard, AuditLogImmutabilityGuard } from '../src/rbac/rbac.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, ForbiddenException, MethodNotAllowedException } from '@nestjs/common';
import { AuditController } from '../src/audit/audit.controller';

describe('Requirement Verification Matrix Tests', () => {
  describe('NFR-1.2: Argon2id Password Hashing & Security', () => {
    it('should hash passwords using Argon2id and verify match', async () => {
      const plain = 'VerySecureMedicalPassword123#';
      const hash = await argon2.hash(plain, { type: argon2.argon2id });

      expect(hash).toContain('$argon2id$');
      const matches = await argon2.verify(hash, plain);
      expect(matches).toBe(true);

      const wrongMatches = await argon2.verify(hash, 'WrongPassword!');
      expect(wrongMatches).toBe(false);
    });
  });

  describe('Secret Stripper for Audit Logging (Credential Leak Prevention)', () => {
    it('should recursively redact password, token, and secret fields from snapshots', () => {
      const rawPayload = {
        id: 'usr_123',
        email: 'doctor@hospital.com',
        password: 'PlainTextPassword123!',
        passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$somehash',
        apiKey: 'sk_live_secret123',
        nested: {
          refreshToken: 'secret_jwt_refresh_token',
          normalField: 'Cardiology',
        },
      };

      const sanitized = stripSecrets(rawPayload);

      expect(sanitized.id).toBe('usr_123');
      expect(sanitized.email).toBe('doctor@hospital.com');
      expect(sanitized.password).toBe('[REDACTED]');
      expect(sanitized.passwordHash).toBe('[REDACTED]');
      expect(sanitized.apiKey).toBe('[REDACTED]');
      expect(sanitized.nested.refreshToken).toBe('[REDACTED]');
      expect(sanitized.nested.normalField).toBe('Cardiology');
    });
  });

  describe('FR-2.1 / FR-2.2: RBAC Evaluation & Boundary Tests', () => {
    let reflector: Reflector;
    let rolesGuard: RolesGuard;

    beforeEach(() => {
      reflector = new Reflector();
      rolesGuard = new RolesGuard(reflector);
    });

    const createMockContext = (user: any, requiredRoles?: string[], requiredPermissions?: string[]): ExecutionContext => {
      jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: string) => {
        if (key === 'roles') return requiredRoles;
        if (key === 'permissions') return requiredPermissions;
        return undefined;
      });

      return {
        getHandler: () => ({}),
        getClass: () => ({}),
        switchToHttp: () => ({
          getRequest: () => ({ user }),
        }),
      } as unknown as ExecutionContext;
    };

    it('RECEPTIONIST user attempting GET /api/audit-logs receives 403 Forbidden', () => {
      const receptionistUser = {
        id: 'usr_recept_01',
        role: 'RECEPTIONIST',
        permissions: ['patient:read', 'patient:create', 'appointment:read'],
      };

      const ctx = createMockContext(receptionistUser, ['SUPER_ADMIN']);
      expect(() => rolesGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('SUPER_ADMIN user attempting GET /api/audit-logs is allowed', () => {
      const superAdminUser = {
        id: 'usr_super_01',
        role: 'SUPER_ADMIN',
        permissions: ['audit:read'],
      };

      const ctx = createMockContext(superAdminUser, ['SUPER_ADMIN']);
      expect(rolesGuard.canActivate(ctx)).toBe(true);
    });

    it('FR-1.4: AI Receptionist token attempting /api/patients is blocked with 403 Forbidden', () => {
      const aiUser = {
        id: 'ai_service_01',
        role: 'AI_SERVICE',
        permissions: ['availability:read', 'booking:create'],
      };

      // /api/patients requires 'patient:read'
      const ctx = createMockContext(aiUser, undefined, ['patient:read']);
      expect(() => rolesGuard.canActivate(ctx)).toThrow(ForbiddenException);
    });

    it('FR-1.4: AI Receptionist token accessing /api/availability is allowed', () => {
      const aiUser = {
        id: 'ai_service_01',
        role: 'AI_SERVICE',
        permissions: ['availability:read', 'booking:create'],
      };

      const ctx = createMockContext(aiUser, undefined, ['availability:read']);
      expect(rolesGuard.canActivate(ctx)).toBe(true);
    });
  });

  describe('NFR-1.1: Audit Log Immutability (Write-Only Guarantee)', () => {
    it('executing DELETE /api/audit-logs/:id throws MethodNotAllowedException (HTTP 405)', () => {
      const mockAuditService = {
        log: jest.fn(),
        findAll: jest.fn(),
      } as any;

      const controller = new AuditController(mockAuditService);

      expect(() => controller.deleteAuditLog('aud_12345')).toThrow(
        MethodNotAllowedException
      );
    });
  });
});
