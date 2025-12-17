
export enum Role {
  // SuperAdmin = 'Super Admin',
  ContentManager = 'CONTENT_MANAGER',
  SupportManager = 'SUPORT_MANAGER',
}
 export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  lastActive: string;
  password?: string;
  confirmPassword?: string;
}

export interface RolePermission {
    name: Role;
    permissions: string[];
}
