import { ParkingSlotStatus } from '@ParkingSlot/enum/parking-slot-status.enum';
import { Location } from '@locations/entities/location.entity';
import { BaseEntity } from '@shared/entity/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('parking_slots')
export class ParkingSlot extends BaseEntity<ParkingSlot> {
  constructor(data?: Partial<ParkingSlot>) {
    super(data);
  }

  @Column()
  extractLocation: string;

  @Column({ type: 'float' })
  priceHour: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'co_user_id', nullable: true })
  coUserId: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Location, (location) => location.parkingSlots)
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ type: 'enum', enum: ParkingSlotStatus, default: ParkingSlotStatus.AVAILABLE })
  status: ParkingSlotStatus;
}
