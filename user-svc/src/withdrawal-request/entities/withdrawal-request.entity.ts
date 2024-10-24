import { BaseEntity } from '@shared/entity/base.entity';
import { User } from '@users/entities/user.entity';
import { WithdrawalRequestStatus } from '@withdrawal-request/enums/withdrawal-request-status.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('withdrawal_requests')
export class WithdrawalRequest extends BaseEntity<WithdrawalRequest> {
  constructor(data?: Partial<WithdrawalRequest>) {
    super(data);
  }

  @Column()
  amount: number;

  @Column({ type: 'enum', enum: WithdrawalRequestStatus, default: WithdrawalRequestStatus.PENDING })
  status: WithdrawalRequestStatus;

  @ManyToOne(() => User, (user) => user.withdrawalRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
