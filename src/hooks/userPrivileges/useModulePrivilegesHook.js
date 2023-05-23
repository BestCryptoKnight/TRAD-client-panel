import { useMemo } from 'react';

export const useModulePrivileges = moduleName => {
  const userPrivilegesData = [
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'organization',
    },
    {
      accessTypes: ['read'],
      name: 'user',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'note',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'claim',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'application',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'document',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'debtor',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'client',
    },
    {
      accessTypes: ['read', 'write'],
      name: 'insurer',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'overdue',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'policy',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'task',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'settings',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'dashboard',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'notification',
    },
    {
      accessTypes: ['full-access', 'write', 'read'],
      name: 'credit-report',
    },
    {
      accessTypes: ['full-access', 'write', 'read'],
      name: 'report',
    },
    {
      accessTypes: ['read', 'write', 'full-access'],
      name: 'import-application-dump',
    },
  ];

  const foundModule = useMemo(
    () => userPrivilegesData.find(module => module.name === moduleName),
    [userPrivilegesData, moduleName]
  );

  const access = {
    hasWriteAccess: false,
    hasReadAccess: false,
    hasFullAccess: false,
  };

  if (foundModule && foundModule.accessTypes) {
    foundModule.accessTypes.forEach(e => {
      switch (e) {
        case 'read':
          access.hasReadAccess = true;
          break;
        case 'write':
          access.hasWriteAccess = true;
          break;
        case 'full-access':
          access.hasFullAccess = true;
          break;
        default:
          break;
      }
    });
  }

  return access;
};
