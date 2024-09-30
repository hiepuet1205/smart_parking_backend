import { User } from '@users/entities/user.entity';
import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource);
  }
}
