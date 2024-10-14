import { Injectable } from "@nestjs/common";
import { RentRequestRepository } from "@shared/repository/location.repository copy";
import { CreateRentRequestDto } from "./dto/create-rent-request.dto";

@Injectable()
export class RentRequestService {
  constructor(private readonly rentRequestRepository: RentRequestRepository) {}

  async create(body: CreateRentRequestDto, userId: number) {
    const rentRequest = await this.rentRequestRepository.save({
      ...body,
      userId
    })
    return rentRequest;
  }
}
