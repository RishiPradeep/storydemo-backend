import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './DTO/create-user.dto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getDetails(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        heatMap: true,
      },
    });
    const storyCount = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        _count: {
          select: {
            stories: true,
          },
        },
      },
    });
    return { ...user, storyCount: storyCount };
  }

  async createUser(createUserDto: CreateUserDto) {
    const check = await this.prisma.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });
    if (check) {
      return { message: 'ok' };
    }
    await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: createUserDto.password,
        username: createUserDto.username,
        currentStreak: 0,
        highestStreak: 0,
        lastSubmit: new Date(),
      },
    });
    return { message: 'Created' };
  }

  async submitStory(email: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const yesterdayEntry = await this.prisma.contributions.findFirst({
      where: {
        userEmail: email,
        date: yesterday,
      },
    });

    const existingEntry = await this.prisma.contributions.findFirst({
      where: {
        userEmail: email,
        date: today,
      },
    });

    if (existingEntry) {
      // If today's entry exists, increment the commits
      await this.prisma.contributions.update({
        where: {
          id: existingEntry.id,
        },
        data: {
          commits: {
            increment: 1,
          },
        },
      });
    } else {
      // If today's entry does not exist, create it and update streaks
      let newStreak = 1;

      if (yesterdayEntry) {
        const user = await this.prisma.user.findUnique({
          where: {
            email: email,
          },
          select: {
            currentStreak: true,
            highestStreak: true,
          },
        });

        newStreak = user.currentStreak + 1;
        const newHighestStreak = Math.max(newStreak, user.highestStreak);

        await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            currentStreak: newStreak,
            highestStreak: newHighestStreak,
          },
        });
      } else {
        // Reset streak if yesterday's entry does not exist
        await this.prisma.user.update({
          where: {
            email: email,
          },
          data: {
            currentStreak: 1,
          },
        });
      }

      await this.prisma.contributions.create({
        data: {
          date: today,
          commits: 1,
          userEmail: email,
        },
      });
    }
  }
}
