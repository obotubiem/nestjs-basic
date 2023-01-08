import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getAllUsers(filters: FilterUserDto) {
    const { username, email } = filters;
    const params = {
      where: { username, email },
      select: {
        password: false,
        salt: false,
      },
    };

    return await this.userRepository.users(params);
  }

  async getOffsetPaginationUsers(params: {
    skip?: number;
    take?: number;
    filters: FilterUserDto;
  }) {
    const { skip, take, filters } = params;
    const { username, email } = filters;

    const userParams = {
      skip,
      take,
      where: { username, email },
      select: {
        password: false,
        salt: false,
      },
    };

    return await this.userRepository.users(userParams);
  }

  async getUserById(id: number) {
    const select = {
      password: false,
      salt: false,
    };
    return await this.userRepository.userByPk(id, { select });
  }

  async createUser(createUserDto: CreateUserDto) {
    const data = {
      ...createUserDto,
      salt: undefined,
    };

    if (data.password) {
      data.salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, data.salt);
    }

    const select = {
      password: false,
      salt: false,
    };

    return await this.userRepository.createUser({ data, select });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.userByPk(id);

    const data = {
      ...updateUserDto,
      salt: undefined,
    };

    if (data.password) {
      data.salt = await bcrypt.genSalt();
      data.password = await bcrypt.hash(data.password, user.salt);
    }

    const select = {
      password: false,
      salt: false,
    };

    return await this.userRepository.updateUser({
      where: { id },
      data,
      select,
    });
  }

  async deleteUser(id: number) {
    const select = {
      password: false,
      salt: false,
    };

    return await this.userRepository.deleteUser({ where: { id }, select });
  }

  async validateUser(email: string, password: string): Promise<User> {
    return await this.userRepository.validateUser(email, password);
  }
}
