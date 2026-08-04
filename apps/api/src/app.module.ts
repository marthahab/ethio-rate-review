import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BusinessModule } from './business/business.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [PrismaModule, BusinessModule, ReviewModule],
  controllers: [AppController],
  providers: [AppService],
  
})
export class AppModule {}