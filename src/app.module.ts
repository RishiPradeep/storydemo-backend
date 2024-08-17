import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [PrismaModule, StoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
