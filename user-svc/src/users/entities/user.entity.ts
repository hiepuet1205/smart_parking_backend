import { BaseEntity } from '@shared/entity/base.entity';
import { UserRole } from '@users/enum/user-role.enum';
import { UserStatus } from '@users/enum/user-status.enum';
import { Vehicle } from '@vehicles/entity/vehicle.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('users')
export class User extends BaseEntity<User> {
  constructor(data?: Partial<User>) {
    super(data);
  }

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, type: 'float' })
  total: number;

  @Column({ nullable: true, name: 'token_password_reset' })
  tokenPasswordReset: string;

  @Column({ nullable: true, name: 'token_password_reset_expires' })
  tokenPasswordResetExpires: Date;

  // @Column({ nullable: true, name: 'token_active' })
  // tokenActive: string;

  // @Column({ nullable: true, name: 'token_active_expires' })
  // tokenActiveExpires: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];
}
