import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { User } from '@shared/decorators/user.decorator';
import { JwtAccessTokenGuard } from '@web-init/guards/jwt-access-token.guard';
import { CreateRentRequestDto } from './dto/create-rent-request.dto';
import { RentRequestService } from './rent.service';
import { Public } from '@shared/decorators/auth.decorator';
import { RentRequestStatus } from './enum/rent-request-status.enum';
import { Roles } from '@shared/decorators/roles.decorator';
import { UserRole } from '@app.constant';

@UseGuards(JwtAccessTokenGuard)
@Controller('rent-requests')
export class RentRequestsController {
  constructor(private readonly rentRequestService: RentRequestService) {}

  @Public()
  @Get('/ipn')
  async ipn(@Query() query: any) {
    return this.rentRequestService.ipn(query);
  }

  @Roles([UserRole.ADMIN])
  @Get('admin')
  async find(@Query() query: { status: RentRequestStatus[] }) {
    return await this.rentRequestService.find(query);
  }

  @Get(':id')
  async getOne(@User('userId') userId: number, @Param('id') id: number) {
    return await this.rentRequestService.getOne(userId, id);
  }

  @Get()
  async findAll(@User('userId') userId: number, @Query() query: { status: RentRequestStatus[] }) {
    return await this.rentRequestService.findAll(userId, query);
  }

  @Post()
  async create(@Body() body: CreateRentRequestDto, @User('userId') userId: number) {
    return await this.rentRequestService.create(body, userId);
  }
}
