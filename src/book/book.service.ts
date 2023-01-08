import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { userSelectSchema } from 'src/user/repositories/user.repository';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookRepository } from './repositories/book.repository';

@Injectable()
export class BookService {
  constructor(private readonly bookRepository: BookRepository) {}

  async getAllBooks(filters: FilterBookDto) {
    const { code, title, year } = filters;

    const params: {
      where?: Prisma.BookWhereInput;
      select?: Prisma.BookSelect;
    } = {
      where: { code, title, year },
      select: {
        createdUser: true,
      },
    };

    return await this.bookRepository.books(params);
  }

  async getOffsetPaginationBooks(params: {
    skip?: number;
    take?: number;
    filters: FilterBookDto;
  }) {
    const { skip, take, filters } = params;
    const { code, title, year } = filters;

    const bookParams = {
      skip,
      take,
      where: { code, title, year },
    };

    return await this.bookRepository.books(bookParams);
  }

  async getBookById(id: string) {
    return await this.bookRepository.book(id, {
      select: {
        createdUser: {
          select: { ...userSelectSchema, password: false, salt: false },
        },
      },
    });
  }

  async createBook(user: User, createBookDto: CreateBookDto) {
    return await this.bookRepository.createBook(
      { ...createBookDto, createdUser: { connect: { id: user.id } } },
      {
        select: {
          createdUser: true,
        },
      },
    );
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    return this.bookRepository.updateBook(id, updateBookDto);
  }

  async deleteBook(id: string) {
    return this.bookRepository.deleteBook(id);
  }
}
