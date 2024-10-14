export class CreateRentRequestDto {
  slotId: number;
  startTime: Date;
  endTime: Date;
  vehicleId: number;
  pricePerHour: number;
  depositAmount: number;
}
