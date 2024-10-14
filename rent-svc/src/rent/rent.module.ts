import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RentRequest } from './entities/rent-request.entity';
import { RentRequestsController } from './rent.controller';
import { RentRequestRepository } from '@shared/repository/location.repository copy';
import { RentRequestService } from './rent.service';

@Module({
  imports: [TypeOrmModule.forFeature([RentRequest])],
  controllers: [RentRequestsController],
  providers: [RentRequestService, RentRequestRepository],
})
export class RentRequestsModule {}
