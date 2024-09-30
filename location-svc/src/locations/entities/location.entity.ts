import { ParkingSlot } from '@ParkingSlot/entity/parking-slot.entity';
import { BaseEntity } from '@shared/entity/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('locations')
export class Location extends BaseEntity<Location> {
  constructor(data?: Partial<Location>) {
    super(data);
  }

  @Column()
  name: string;

  @Column({ unique: true })
  location: string;

  @Column({ type: 'float' })
  long: number;

  @Column({ type: 'float' })
  lat: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  image: string;

  @OneToMany(() => ParkingSlot, (parkingSlot) => parkingSlot.location)
  parkingSlots: ParkingSlot[];
}