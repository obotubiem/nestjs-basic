import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterPaginatedUserDto } from './dto/filter-paginated-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOkResponse({ description: 'Users retrieved successfully.' })
  getAllUsers(@Query() params: FilterUserDto) {
    return this.userService.getAllUsers(params);
  }

  @Get('/paginated')
  @ApiOkResponse({ description: 'Users retrieved successfully.' })
  getOffsetPaginatedUsers(@Query() params: FilterPaginatedUserDto) {
    return this.userService.getOffsetPaginationUsers({
      filters: Object.assign(new FilterUserDto(), params),
      take: params.take,
      skip: params.skip,
    });
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'User retrieved successfully.' })
  @ApiNotFoundResponse({ description: 'User not found.' })
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'User created successfully.' })
  createUser(@Body() payload: CreateUserDto) {
    return this.userService.createUser(payload);
  }

  @Put('/:id')
  @ApiOkResponse({ description: 'Book updated successfully.' })
  @ApiNotFoundResponse({ description: 'Book not found.' })
  updateBook(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, payload);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Book deleted successfully.' })
  @ApiNotFoundResponse({ description: 'Book not found.' })
  deleteBook(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
