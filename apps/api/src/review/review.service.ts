import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Prisma } from '@prisma/client';
@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateReviewDto, userId: number) {
    const business = await this.prisma.business.findUnique({
      where: { id: dto.businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId === userId) {
      throw new ForbiddenException(
        'You cannot review your own business.',
      );
    }

    let review;
    try {      review = await this.prisma.review.create({
        data: {
          rating: dto.rating,
          comment: dto.comment,
          userId,
          businessId: dto.businessId,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'You have already reviewed this business.',
        );
      }
      throw error;
    }

    const reviews = await this.prisma.review.findMany({
      where: { businessId: dto.businessId },
    });

    const average =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await this.prisma.business.update({
      where: { id: dto.businessId },
      data: {
        averageRating: average,
        reviewCount: reviews.length,
      },
    });

    return review;
  }
}