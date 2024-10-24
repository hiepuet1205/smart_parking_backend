import { Payment } from '@payment/entities/payment.entity';
import { BaseEntity } from '@shared/entity/base.entity';
import { UserRole } from '@users/enum/user-role.enum';
import { UserStatus } from '@users/enum/user-status.enum';
import { Vehicle } from '@vehicles/entity/vehicle.entity';
import { WithdrawalRequest } from '@withdrawal-request/entities/withdrawal-request.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

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

  @Column({ nullable: true, type: 'float' })
  totalEarning: number;

  @Column({ nullable: true, type: 'float' })
  totalAmountWithdraw: number;

  @Column({ nullable: true, name: 'token_password_reset' })
  tokenPasswordReset: string;

  @Column({ nullable: true, name: 'token_password_reset_expires' })
  tokenPasswordResetExpires: Date;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.INACTIVE })
  status: UserStatus;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehicles: Vehicle[];

  @OneToMany(() => WithdrawalRequest, (vehicle) => vehicle.user)
  withdrawalRequests: WithdrawalRequest[];

  @Column('text', { array: true, nullable: true })
  firebaseDeviceTokens: string[];

  @OneToOne(() => Payment)
  @JoinColumn()
  payment: Payment;
}
