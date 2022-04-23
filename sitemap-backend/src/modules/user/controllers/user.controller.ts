import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from '../services';
import { UserDocument } from '../schemas';
import { CreateUserDTO } from '../dtos';
import { CurrentUser, Public } from 'src/modules/auth/constants';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('/email/:email')
  async isEmailExists(@Param('email') email): Promise<{ exist: boolean }> {
    return { exist: await this.userService.isEmailExists(email) };
  }
  @Get('/')
  async getUsers(@CurrentUser() user): Promise<UserDocument[]> {
    return await this.userService.getUsers(user);
  }

  @Post('/')
  async createUser(
    @Body() createUserDTO: CreateUserDTO,
    @CurrentUser() user,
  ): Promise<UserDocument> {
    return await this.userService.createUser(createUserDTO, user);
  }

  @Get('/:id')
  async getUserById(@Param('id') id): Promise<UserDocument> {
    return await this.userService.getUserById(id);
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id,
    @Body() body: CreateUserDTO,
  ): Promise<UserDocument> {
    return await await this.userService.updateUser(id, body);
  }

  @Delete('/:id')
  async delete(@Param('id') id): Promise<UserDocument> {
    return await this.userService.deleteUser(id);
  }
}
