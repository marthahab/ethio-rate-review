import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { reviews: true, businesses: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateUserRole(id: number, role: Role) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { businesses: true },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const businessIds = user.businesses.map((b) => b.id);

    await this.prisma.$transaction(async (tx) => {
      if (businessIds.length > 0) {
        await tx.businessCategory.deleteMany({
          where: { businessId: { in: businessIds } },
        });
        await tx.review.deleteMany({
          where: { businessId: { in: businessIds } },
        });
        await tx.business.deleteMany({
          where: { id: { in: businessIds } },
        });
      }

      const ownReviews = await tx.review.findMany({
        where: { userId: id },
      });
      const affectedBusinessIds = [
        ...new Set(ownReviews.map((r) => r.businessId)),
      ];

      await tx.review.deleteMany({ where: { userId: id } });

      for (const businessId of affectedBusinessIds) {
        const agg = await tx.review.aggregate({
          where: { businessId },
          _avg: { rating: true },
          _count: { rating: true },
        });
        await tx.business.update({
          where: { id: businessId },
          data: {
            averageRating: agg._avg.rating ?? 0,
            reviewCount: agg._count.rating,
          },
        });
      }

      await tx.user.delete({ where: { id } });
    });

    return { deleted: true };
  }

  getBusinesses() {
    return this.prisma.business.findMany({
      select: {
        id: true,
        name: true,
        city: true,
        averageRating: true,
        reviewCount: true,
        createdAt: true,
        owner: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteBusiness(id: number) {
    const business = await this.prisma.business.findUnique({ where: { id } });
    if (!business) {
      throw new NotFoundException('Business not found');
    }

    await this.prisma.$transaction([
      this.prisma.businessCategory.deleteMany({ where: { businessId: id } }),
      this.prisma.review.deleteMany({ where: { businessId: id } }),
      this.prisma.business.delete({ where: { id } }),
    ]);

    return { deleted: true };
  }

  getReviews() {
    return this.prisma.review.findMany({
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true } },
        business: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteReview(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    await this.prisma.review.delete({ where: { id } });

    const agg = await this.prisma.review.aggregate({
      where: { businessId: review.businessId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    await this.prisma.business.update({
      where: { id: review.businessId },
      data: {
        averageRating: agg._avg.rating ?? 0,
        reviewCount: agg._count.rating,
      },
    });

    return { deleted: true };
  }
}