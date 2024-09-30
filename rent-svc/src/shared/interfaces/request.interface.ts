import { UserRole } from '@app.constant';
import { Request } from 'express';

export interface User {
  user_id: number;
  role: UserRole;
}

export interface RequestWithUser extends Request {
  user: User;
}
