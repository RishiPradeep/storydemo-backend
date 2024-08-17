import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { StoryService } from './story.service';
import { CreateStoryDto } from './DTO/create-story.dto';
import { UpdateStoryDto } from './DTO/update-story.dto';

@Controller('story')
export class StoryController {
  constructor(private readonly storyService: StoryService) {}

  @Get('single/:id')
  async getStoryDetails(@Param('id', ParseIntPipe) id: number) {
    return await this.storyService.getStoryDetails(id);
  }

  @Get(':email')
  async getUserStories(@Param('email') email: string) {
    return await this.storyService.getUserStories(email);
  }

  @Post()
  async createStory(@Body(ValidationPipe) createStoryDto: CreateStoryDto) {
    return await this.storyService.createStory(createStoryDto);
  }

  @Post('update')
  async updateStory(@Body(ValidationPipe) updateStoryDto: UpdateStoryDto) {
    return await this.storyService.updateStory(updateStoryDto);
  }
}
