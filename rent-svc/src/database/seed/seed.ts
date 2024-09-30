// import { Location } from '@location/entities/location.entity';
// import { dbConfig } from '@config/database';
// import { Logger } from '@nestjs/common';
// import { DataSource } from 'typeorm';
// import { locationDatas, slotDatas } from './seed.data';
// import { User } from '@users/entities/user.entity';
// import { SlotParking } from '@slot-parking/entities/slot-parking.entity';

// const logger = new Logger('Seed');

// export async function seed(datasource: DataSource): Promise<void> {
//   const locationRepository = datasource.getRepository(Location);

//   await locationRepository.save(locationDatas);

//   const userRepository = datasource.getRepository(User);
//   const slotParkingRepository = datasource.getRepository(SlotParking);

//   for (const slot of slotDatas) {
//     const user = await userRepository.findOne({ where: { id: slot.userId } });
//     const location = await locationRepository.findOne({ where: { id: slot.locationId } });
//     await slotParkingRepository.save({ ...slot, user, location });
//   }
// }

// async function runSeed() {
//   const datasource = new DataSource(dbConfig());
//   if (!datasource.isInitialized) {
//     await datasource.initialize();
//   }
//   await seed(datasource);
//   await datasource.destroy();
// }

// if (process.env.NODE_ENV === 'development') {
//   runSeed();
// } else {
//   logger.warn('Not allow run seed on this environment!!');
// }
