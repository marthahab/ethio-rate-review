import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: 'Coffee', description: 'Coffee shops and coffee houses' },
    { name: 'Cafe', description: 'Cafes and casual dining places' },
    { name: 'Restaurant', description: 'Restaurants and dining establishments' },
    { name: 'Hotel', description: 'Hotels and accommodation' },
    { name: 'Pharmacy', description: 'Pharmacies and medicine stores' },
    { name: 'Grocery', description: 'Grocery stores and supermarkets' },
    { name: 'Salon', description: 'Hair and beauty salons' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: { description: category.description },
      create: category,
    });
  }

  console.log('Categories seeded successfully');

  const coffee = await prisma.category.findUnique({ where: { name: 'Coffee' } });
  const cafe = await prisma.category.findUnique({ where: { name: 'Cafe' } });

  if (!coffee || !cafe) {
    throw new Error('Required categories not found');
  }

  const tomoca = await prisma.business.findUnique({ where: { id: 1 } });
  const kaldis = await prisma.business.findUnique({ where: { id: 2 } });
  const lucy = await prisma.business.findUnique({ where: { id: 3 } });
  const martha = await prisma.business.findUnique({ where: { id: 4 } });

  if (tomoca) {
    await prisma.businessCategory.upsert({
      where: {
        businessId_categoryId: { businessId: tomoca.id, categoryId: coffee.id },
      },
      update: {},
      create: { businessId: tomoca.id, categoryId: coffee.id },
    });
  }

  if (kaldis) {
    await prisma.businessCategory.upsert({
      where: {
        businessId_categoryId: { businessId: kaldis.id, categoryId: coffee.id },
      },
      update: {},
      create: { businessId: kaldis.id, categoryId: coffee.id },
    });
  }

  for (const business of [lucy, martha]) {
    if (business) {
      await prisma.businessCategory.upsert({
        where: {
          businessId_categoryId: { businessId: business.id, categoryId: cafe.id },
        },
        update: {},
        create: { businessId: business.id, categoryId: cafe.id },
      });
    }
  }

 if (tomoca) {
    await prisma.business.update({
      where: { id: tomoca.id },
      data: { googleMapsUrl: 'https://share.google/gebTD5i6lCA0Yh96c' },
    });
  }

  if (kaldis) {
    await prisma.business.update({
      where: { id: kaldis.id },
      data: { googleMapsUrl: 'https://maps.app.goo.gl/sqR8gyGHQ8q6qoeB8' },
    });
  }

  if (lucy) {
    await prisma.business.update({
      where: { id: lucy.id },
      data: {
        name: 'Fili Coffee',
        description: 'Warehouse-style café and roastery in the Lafto area, known for its Ethiopian single-origin coffee.',
        city: 'Addis Ababa',
        googleMapsUrl: 'https://maps.app.goo.gl/ffoDWfFcVrx3F3ox9',
      },
    });
  }

  if (martha) {
    await prisma.business.update({
      where: { id: martha.id },
      data: {
        name: 'Wild Coffee',
        description: 'Coffee shop in Addis Ababa known for its coffee and atmosphere.',
        city: 'Addis Ababa',
        googleMapsUrl: 'https://maps.app.goo.gl/WzmsKdA7KVomnKj8A',
      },
    });
  }

  console.log('Business-category links seeded successfully');
}


main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });