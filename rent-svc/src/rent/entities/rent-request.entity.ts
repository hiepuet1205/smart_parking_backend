import { BaseEntity } from '@shared/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('rent_request')
export class RentRequest extends BaseEntity<RentRequest> {
  constructor(data?: Partial<RentRequest>) {
    super(data);
  }

  @Column({name: 'slot_id'})
  slotId: number;

  @Column({name: 'start_time'})
  startTime: Date;

  @Column({name: 'end_time'})
  endTime: Date;

  @Column({name: 'vehicle_id'})
  vehicleId: number;

  @Column({name: 'user_id'})
  userId: number;

  @Column({name: 'price_per_hour'})
  pricePerHour: number;

  @Column({name: 'deposit_amount'})
  depositAmount: number;
}
