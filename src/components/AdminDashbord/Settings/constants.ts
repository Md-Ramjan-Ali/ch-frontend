
import { AdminUser, Role, RolePermission } from './types';

export const ADMIN_USERS: AdminUser[] = [
 
  {
    id: 2,
    name: 'Anna Verdi',
    email: 'anna.verdi@italianapp.com',
    role: Role.ContentManager,
    lastActive: '2024-09-28',
  },
  {
    id: 3,
    name: 'Luigi Bianchi',
    email: 'luigi.bianchi@italianapp.com',
    role: Role.SupportManager,
    lastActive: '2024-09-29',
  },
];

export const ROLE_PERMISSIONS: RolePermission[] = [
 
    {
        name: Role.ContentManager,
        permissions: [
            'Content creation/editing',
            'Flashcard management',
            'Lesson publishing',
            'Content analytics'
        ]
    },
    {
        name: Role.SupportManager,
        permissions: [
            'Support ticket access',
            'User account support',
            'Basic user management',
            'Support analytics'
        ]
    }
];

export const LANGUAGES = ['English', 'Italiano', 'Español', 'Français', 'Deutsch'];
export const TIMEZONES = ['Europe/Rome', 'America/New_York', 'America/Los_Angeles', 'Asia/Tokyo', 'Australia/Sydney'];
export const FONTS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat'];
