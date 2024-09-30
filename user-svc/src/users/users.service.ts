import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '@shared/repository/user.repository';
import { FileService } from '@shared/services/file.service';
import { SignUpDto } from './dto/create-user.dto';
import { UserStatus } from './enum/user-status.enum';
import * as bcrypt from 'bcryptjs';
import { UserSerialize } from '@shared/serialize/user.serialize';
import { GetUserByEmailRequest, GetUserByEmailResponse, GetUserByIdRequest, GetUserByIdResponse } from '@protos/user/user';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UserRepository,
    private readonly fileService: FileService,
  ) {}

  async signUp(signUpDto: SignUpDto, file: Express.Multer.File) {
    const user = await this.usersRepository.findOne({ where: { email: signUpDto.email } });

    if (user) throw new BadRequestException('Email already exists');

    const uploadResult = await this.fileService.uploadPublicFile(file.buffer, file.originalname);

    const data = await this.usersRepository.save({
      ...signUpDto,
      avatar: uploadResult.Location,
      role: signUpDto.role,
      status: UserStatus.ACTIVE,
      password: await bcrypt.hash(signUpDto.password, 10),
    });

    const serializerData = new UserSerialize(data).perform();
    return {
      status: 'success',
      message: 'Sign Up successfully',
      data: serializerData,
    };
  }

  async getUserById(_request: GetUserByIdRequest) {
    return {
      user: await this.usersRepository.findOne({ where: { id: _request.id } }),
    } as unknown as GetUserByIdResponse;
  }

  async getUserByEmail(_request: GetUserByEmailRequest) {
    return {
      user: await this.usersRepository.findOne({ where: { email: _request.email } }),
    } as unknown as GetUserByEmailResponse;
  }

  async getInfo(userId: number) {
    return await this.usersRepository.findOne({ where: { id: userId } });
  }
}
