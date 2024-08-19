import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateStoryDto } from './DTO/create-story.dto';
import { UpdateStoryDto } from './DTO/update-story.dto';

@Injectable()
export class StoryService {
  constructor(private readonly prisma: PrismaService) {}

  async getStoryDetails(id: number) {
    const story = await this.prisma.story.findUnique({
      where: {
        id: id,
      },
    });
    if (!story) {
      return { message: 'Story Not Found' };
    } else {
      return { message: 'Story Found', story: story };
    }
  }

  async createStory(createStoryDto: CreateStoryDto) {
    try {
      await this.prisma.story.create({
        data: {
          story: createStoryDto.story,
          title: createStoryDto.title,
          userEmail: createStoryDto.email,
          visibility: createStoryDto.visibility,
        },
      });
      return { message: 'Created' };
    } catch (error) {
      throw error;
    }
  }

  async getUserStories(email: string) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const stories = await this.prisma.story.findMany({
        where: {
          userEmail: email,
          createdAt: {
            gte: today,
            lte: tomorrow,
          },
        },
      });
      return stories;
    } catch (error) {
      throw error;
    }
  }

  async updateStory(updateStoryDto: UpdateStoryDto) {
    try {
      const datatoUpdate = {
        title: '',
        story: '',
      };
      updateStoryDto.story
        ? (datatoUpdate.story = updateStoryDto.story)
        : (datatoUpdate.story = '');
      updateStoryDto.title
        ? (datatoUpdate.title = updateStoryDto.title)
        : (datatoUpdate.title = '');
      await this.prisma.story.update({
        where: {
          id: updateStoryDto.id,
        },
        data: datatoUpdate,
      });
      return { message: 'Updated' };
    } catch (error) {
      throw error;
    }
  }
}
