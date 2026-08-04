import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.business.findMany({
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }

  async create(data: CreateBusinessDto) {
    const { categoryIds, ...businessData } = data;

    return this.prisma.business.create({
      data: {
        ...businessData,
        categories: categoryIds
          ? {
              create: categoryIds.map((categoryId) => ({
                category: {
                  connect: { id: categoryId },
                },
              })),
            }
          : undefined,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  }
}
