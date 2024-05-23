import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create.dto';
import { User, UserSafe } from './user.entity';
import { hashData } from 'src/common/utilities/argon';
import { UpdateUserDto } from './dto/update.dto';
import { DatatableParams } from 'types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUser(params: DatatableParams): Promise<{
    data: UserSafe[];
    total: number;
  }> {
    const [data, total] = await Promise.all([
      this.userRepository.findAll(params),
      this.userRepository.getTotal(params),
    ]);

    return { data, total };
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const findByEmail = await this.userRepository.findByEmail(dto.email);
    if (findByEmail != null) {
      const errorMessages = {
        email: ['email already exists'],
      };
      const errorResponse = {
        statusCode: 400,
        error: 'validation error',
        message: errorMessages,
      };

      throw new BadRequestException(errorResponse);
    }

    const passwordHash = await hashData(dto.password);
    const user: User = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      isVerified: 0,
    };

    const create = await this.userRepository.create(user);
    delete create.password;

    return create;
  }

  async updateUser(id: number, dto: UpdateUserDto) {
    const findById = await this.userRepository.findById(id);
    if (!findById) throw new BadRequestException('Data not found.');

    let passwordHash = findById.password;

    console.log('findById', findById);
    console.log('id', id);

    if (dto.password != undefined && dto.password != '') {
      passwordHash = await hashData(dto.password);
    }

    const user: User = {
      name: dto.name,
      email: dto.email,
      password: passwordHash,
      isVerified: dto.isVerified,
    };

    const update = await this.userRepository.update(id, user);
    delete update.password;

    return update;
  }

  async findUserById(id: number): Promise<User> {
    return await this.userRepository.findById(id);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findByEmail(email);
  }

  async updateRefreshToken(id: number, refreshToken: string): Promise<User> {
    return await this.userRepository.updateRefreshToken(id, refreshToken);
  }

  async deleteUser(id: number): Promise<User> {
    return await this.userRepository.delete(id);
  }
}
