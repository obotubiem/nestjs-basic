import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import * as bcrypt from 'bcrypt';

export const userSelectSchema = {
  id: true,
  email: true,
  username: true,
  name: true,
  password: true,
  salt: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    select?: Prisma.UserSelect;
  }): Promise<User[]> {
    const { skip, take, cursor, where, select, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        ...userSelectSchema,
        ...select,
      },
    });
  }

  async user(params: Prisma.UserFindUniqueArgs): Promise<User | null> {
    const { where, select } = params;
    return this.prisma.user.findUnique({
      where,
      select: {
        ...userSelectSchema,
        ...select,
      },
    });
  }

  async userByPk(
    pk: number,
    params?: {
      select: Prisma.UserSelect;
    },
  ) {
    const { select } = params;
    return this.prisma.user.findUnique({
      where: { id: pk },
      select: { ...userSelectSchema, ...select },
    });
  }

  async createUser(params: Prisma.UserCreateArgs): Promise<User> {
    const { data, select } = params;
    return this.prisma.user.create({
      data,
      select: {
        ...userSelectSchema,
        ...select,
      },
    });
  }

  async updateUser(params: Prisma.UserUpdateArgs): Promise<User> {
    const { where, data, select } = params;

    return this.prisma.user.update({
      data,
      where,
      select: {
        ...userSelectSchema,
        ...select,
      },
    });
  }

  async deleteUser(params: Prisma.UserDeleteArgs): Promise<User> {
    const { where, select } = params;
    return this.prisma.user.delete({
      where,
      select: {
        ...userSelectSchema,
        ...select,
      },
    });
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      const hash = await bcrypt.hash(password, user.salt);
      if (hash === user.password) return user;
    }

    return null;
  }
}
