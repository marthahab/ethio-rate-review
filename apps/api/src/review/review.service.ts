import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        rating: dto.rating,
        comment: dto.comment,
        userId: dto.userId,
        businessId: dto.businessId,
      },
    });

    const reviews = await this.prisma.review.findMany({
      where: {
        businessId: dto.businessId,
      },
    });

    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.business.update({
      where: {
        id: dto.businessId,
      },
      data: {
        averageRating: average,
        reviewCount: reviews.length,
      },
    });

    return review;
  }
}