import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BusinessModule } from './business/business.module';
import { ReviewModule } from './review/review.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';

@Module({
  imports: [PrismaModule, BusinessModule, ReviewModule, AuthModule, CategoryModule],
  controllers: [AppController],
  providers: [AppService],
  
})

export class AppModule {}

