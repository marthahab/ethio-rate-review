import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

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

  findMine(ownerId: number) {
    return this.prisma.business.findMany({
      where: { ownerId },
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
      orderBy: { createdAt: 'desc' },
    });
  }

 async create(dto: CreateBusinessDto, ownerId: number) {
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
    imageUrl,
    category,
    categoryIds,
  } = dto;

  let categoryCreate;

  if (category) {
    const categoryRecord = await this.prisma.category.upsert({
      where: { name: category },
      update: {},
      create: { name: category },
    });

    categoryCreate = [
      {
        category: {
          connect: { id: categoryRecord.id },
        },
      },
    ];
  } else if (categoryIds?.length) {
    categoryCreate = categoryIds.map((categoryId: number) => ({
      category: {
        connect: {
          id: categoryId,
        },
      },
    }));
  }

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
      imageUrl,

      owner: {
        connect: {
          id: ownerId,
        },
      },

      categories: categoryCreate
        ? {
            create: categoryCreate,
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
}  async update(
    id: number,
    dto: UpdateBusinessDto,
    user: { id: number; role: string },
  ) {
    const business = await this.prisma.business.findUnique({
      where: { id },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== user.id && user.role !== 'ADMIN') {
      throw new ForbiddenException('You do not own this business.');
    }

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
      imageUrl,
    } = dto;

    return this.prisma.business.update({
      where: { id },
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
        imageUrl,
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