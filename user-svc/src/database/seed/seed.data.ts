// /* eslint-disable max-len */
// import { faker } from '@faker-js/faker';
// import { CreateLocationDto } from '@location/dto/create-location.dto';
// import { SlotParkingStatus } from '@slot-parking/enums/slot-parking-status.enum';

// export const locationDatas: CreateLocationDto[] = [
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
//   { address: faker.location.streetAddress(), long: faker.location.longitude(), lat: faker.location.latitude() },
// ];

// export const slotDatas: any[] = [
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A46-B34-C41',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A55-B91-C41',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A76-B15-C76',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A76-B24-C52',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A53-B17-C82',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A1-B23-C67',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A90-B20-C6',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A41-B18-C16',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A84-B64-C15',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A100-B43-C20',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A87-B87-C10',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A61-B50-C65',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A79-B14-C42',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A83-B29-C80',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A42-B16-C87',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A74-B49-C86',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A62-B23-C28',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A68-B9-C11',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A11-B17-C11',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A10-B33-C24',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
//   {
//     userId: 5,
//     locationId: 12,
//     extractLocation: 'A68-B89-C30',
//     start: '09:00:00',
//     end: '10:00:00',
//     status: SlotParkingStatus.AVAILABLE,
//     image:
//       'https://fruitables.s3.ap-southeast-1.amazonaws.com/01f15fa1-8596-4144-a7c9-a4a2c3b9ae55_1715227731504_images_Screenshot+from+2024-05-08+16-10-24.png',
//   },
// ];
