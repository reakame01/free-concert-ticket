import { Role } from '@/common/enums/role.enum';

export interface AuthenticatedUser {
  id: string;
  username: string;
  role: Role;
}
