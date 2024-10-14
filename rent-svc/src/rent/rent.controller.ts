import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { RentRequestService } from './rent.service';
import { CreateRentRequestDto } from './dto/create-rent-request.dto';

@UseGuards(JwtAccessTokenGuard)
@Controller('rent-requests')
export class RentRequestsController {
  constructor(private readonly rentRequestService: RentRequestService) {}

  @Post()
  async create(@Body() body: CreateRentRequestDto, @User('userId') userId: number) {
    return await this.rentRequestService.create(body, userId);
  }
}
