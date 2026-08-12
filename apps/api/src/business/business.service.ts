import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';

@Injectable()
export class BusinessService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
  search?: string,
  city?: string,
  category?: string,
  page = 1,
  limit = 10,
  sort = 'rating',
) {
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
      ],
    }),

    ...(city && {
      city: {
        equals: city,
        mode: 'insensitive' as const,
      },
    }),

    ...(category && {
      categories: {
        some: {
          category: {
            name: {
              equals: category,
              mode: 'insensitive' as const,
            },
          },
        },
      },
    }),
  };
  const orderBy =
    sort === 'newest'
      ? { createdAt: 'desc' as const }
      : { averageRating: 'desc' as const };

  const [businesses, total] = await Promise.all([
    this.prisma.business.findMany({
      where,
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),

    this.prisma.business.count({
      where,
    }),
  ]);

  return {
    data: businesses,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPreviousPage: page > 1,
    },
  };
}

  async findOne(id: number) {
    const business = await this.prisma.business.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }
 async create(dto: CreateBusinessDto) {
  const {
    name,
    description,
    address,
    city,
    latitude,
    longitude,
    phone,
    website,
    googleMapsUrl,
    categoryIds,
  }  = dto;

  return this.prisma.business.create({
    data: {
      name,
      description,
      address,
      city,
      latitude,
      longitude,
      phone,
      website,
      googleMapsUrl,
      categories: categoryIds?.length
        ? {
            create: categoryIds.map((categoryId: number) => ({
              category: {
                connect: {
                  id: categoryId,
                },
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