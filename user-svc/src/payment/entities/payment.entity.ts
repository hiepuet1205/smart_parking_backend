import { AccountType } from '@payment/enums/account-type.enum';
import { BaseEntity } from '@shared/entity/base.entity';
import { User } from '@users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity('payments')
export class Payment extends BaseEntity<Payment> {
  constructor(data?: Partial<Payment>) {
    super(data);
  }

  @Column()
  bankCode: string;

  @Column()
  accountNo: string;

  @Column()
  accountName: string;

  @Column({ type: 'enum', enum: AccountType })
  accountType: AccountType;

  @OneToOne(() => User, (user) => user.payment)
  user: User;
}
