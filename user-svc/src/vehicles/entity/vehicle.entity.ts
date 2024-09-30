import { BaseEntity } from '@shared/entity/base.entity';
import { User } from '@users/entities/user.entity';
import { VehicleType } from '@vehicles/enum/vehicle-type.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('vehicles')
export class Vehicle extends BaseEntity<Vehicle> {
  constructor(data?: Partial<Vehicle>) {
    super(data);
  }

  @Column({ type: 'enum', enum: VehicleType })
  type: VehicleType;

  @Column({ name: 'license_plates' })
  licensePlates: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.vehicles)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
