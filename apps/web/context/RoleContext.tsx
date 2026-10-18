'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoleName, UserSession } from '@hospital/shared-types';

interface RoleContextType {
  currentRole: RoleName;
  currentUser: UserSession;
  setRole: (role: RoleName) => void;
  canAccessAuditLogs: boolean;
  canManageUsers: boolean;
  canEditPatients: boolean;
}

const DEFAULT_USERS: Record<RoleName, UserSession> = {
  SUPER_ADMIN: {
    id: 'usr_superadmin_01',
    email: 'superadmin@hospital.com',
    fullName: 'Dr. Arthur Vance (Super Admin)',
    role: 'SUPER_ADMIN',
    permissions: [
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
  },
  ADMIN: {
    id: 'usr_admin_02',
    email: 'admin@hospital.com',
    fullName: 'Clara Oswald (Operations Admin)',
    role: 'ADMIN',
    permissions: [
      'patient:read',
      'patient:create',
      'patient:update',
      'appointment:read',
      'appointment:create',
      'appointment:update',
      'report:read',
    ],
  },
  RECEPTIONIST: {
    id: 'usr_recept_03',
    email: 'reception@hospital.com',
    fullName: 'Emily Thorne (Lead Receptionist)',
    role: 'RECEPTIONIST',
    permissions: [
      'patient:read',
      'patient:create',
      'patient:update',
      'appointment:read',
      'appointment:create',
      'appointment:update',
      'appointment:cancel',
    ],
  },
  DOCTOR: {
    id: 'usr_doc_04',
    email: 'dr.jenkins@hospital.com',
    fullName: 'Dr. Sarah Jenkins (Cardiology)',
    role: 'DOCTOR',
    permissions: ['patient:read', 'appointment:read', 'appointment:update'],
  },
  NURSE: {
    id: 'usr_nurse_05',
    email: 'nurse.joy@hospital.com',
    fullName: 'Nurse Joy (Triage)',
    role: 'NURSE',
    permissions: ['patient:read', 'appointment:read', 'appointment:update'],
  },
  AI_SERVICE: {
    id: 'usr_ai_06',
    email: 'ai-voice@service.internal',
    fullName: 'AI Voice Receptionist (Agent)',
    role: 'AI_SERVICE',
    permissions: ['availability:read', 'booking:create'],
  },
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<RoleName>('SUPER_ADMIN');

  const setRole = (role: RoleName) => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hms_demo_role', role);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hms_demo_role') as RoleName;
      if (saved && DEFAULT_USERS[saved]) {
        setCurrentRole(saved);
      }
    }
  }, []);

  const currentUser = DEFAULT_USERS[currentRole];
  const canAccessAuditLogs = currentRole === 'SUPER_ADMIN';
  const canManageUsers = currentRole === 'SUPER_ADMIN' || currentRole === 'ADMIN';
  const canEditPatients = ['SUPER_ADMIN', 'ADMIN', 'RECEPTIONIST'].includes(currentRole);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser,
        setRole,
        canAccessAuditLogs,
        canManageUsers,
        canEditPatients,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
