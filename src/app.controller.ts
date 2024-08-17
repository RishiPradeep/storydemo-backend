import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './DTO/create-user.dto';

@Controller('main')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get(':email')
  async getDetails(@Param('email') email: string) {
    return await this.appService.getDetails(email);
  }

  @Post()
  async createUser(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return await this.appService.createUser(createUserDto);
  }

  @Post(':email')
  async submitStory(@Param('email') email: string) {
    console.log(email);
    return await this.appService.submitStory(email);
  }
}
