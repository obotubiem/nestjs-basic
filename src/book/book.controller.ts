import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Put, Query, UseGuards } from '@nestjs/common/decorators';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/get-user.decorator';
import { JwtGuard } from 'src/guard/jwt.guard';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { FilterBookDto } from './dto/filter-book.dto';
import { FilterPaginatedBookDto } from './dto/filter-paginated-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('book')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  @ApiOkResponse({ description: 'Books retrieved successfully.' })
  getAllBooks(@Query() params: FilterBookDto) {
    return this.bookService.getAllBooks(params);
  }

  @Get('/paginated')
  @ApiOkResponse({ description: 'Books retrieved successfully.' })
  getOffsetPaginatedBooks(@Query() params: FilterPaginatedBookDto) {
    return this.bookService.getOffsetPaginationBooks({
      filters: Object.assign(new FilterBookDto(), params),
      take: params.take,
      skip: params.skip,
    });
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Book retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'Book not found.' })
  getBookById(@Param('id') id: string) {
    return this.bookService.getBookById(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Book created successfully.' })
  createBook(@GetUser() user: User, @Body() payload: CreateBookDto) {
    return this.bookService.createBook(user, payload);
  }

  @Put('/:id')
  @ApiOkResponse({ description: 'Book updated successfully.' })
  @ApiNotFoundResponse({ description: 'Book not found.' })
  updateBook(@Param('id') id: string, @Body() payload: UpdateBookDto) {
    return this.bookService.updateBook(id, payload);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Book deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Book not found.' })
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
