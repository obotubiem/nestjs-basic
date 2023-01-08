import { Injectable } from '@nestjs/common';
import { Prisma, Book } from '@prisma/client';
import { BaseRepository } from 'src/base-repository';

export const bookSelectSchema = {
  id: true,
  code: true,
  title: true,
  year: true,
  description: true,
  createdUserId: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class BookRepository extends BaseRepository {
  async books(
    params: {
      skip?: number;
      take?: number;
      cursor?: Prisma.BookWhereUniqueInput;
      where?: Prisma.BookWhereInput;
      orderBy?: Prisma.BookOrderByWithRelationInput;
      select?: Prisma.BookSelect;
    } = {},
  ): Promise<Book[]> {
    const { skip, take, cursor, where, select, orderBy } = params;
    return this.prisma.book.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      select: {
        ...bookSelectSchema,
        ...select,
      },
    });
  }

  async book(
    whereOrPk: Prisma.BookWhereUniqueInput | string,
    options: {
      select?: Prisma.BookSelect;
    } = {},
  ): Promise<Book | null> {
    const { select } = options;
    const where = this.getWhereOrPk(whereOrPk);

    return this.prisma.book.findUniqueOrThrow({
      where,
      select: { ...bookSelectSchema, ...select },
    });
  }

  async createBook(
    data: Prisma.BookCreateInput,
    options: {
      select?: Prisma.BookSelect;
    } = {},
  ): Promise<Book> {
    const { select } = options;
    return this.prisma.book.create({
      data,
      select: { ...bookSelectSchema, ...select },
    });
  }

  async updateBook(
    whereOrPk: Prisma.BookWhereUniqueInput | string,
    data: Prisma.BookUpdateInput,
    options: {
      select?: Prisma.BookSelect;
    } = {},
  ): Promise<Book> {
    const { select } = options;
    const where = this.getWhereOrPk(whereOrPk);

    return this.prisma.book.update({
      data,
      where,
      select: { ...bookSelectSchema, ...select },
    });
  }

  async deleteBook(
    whereOrPk: Prisma.BookWhereUniqueInput | string,
    options: {
      select?: Prisma.BookSelect;
    } = {},
  ) {
    const { select } = options;
    const where = this.getWhereOrPk(whereOrPk);

    return this.prisma.book.delete({
      where,
      select: { ...bookSelectSchema, ...select },
    });
  }
}
