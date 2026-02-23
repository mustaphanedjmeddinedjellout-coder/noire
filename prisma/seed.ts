import 'dotenv/config';
import {PrismaClient} from '@prisma/client';
import {hash} from 'bcryptjs';

const prisma = new PrismaClient();

const wilayas = [
  ['01', 'Adrar', 'Adrar', 'أدرار', 950, 750],
  ['02', 'Chlef', 'Chlef', 'الشلف', 800, 550],
  ['03', 'Laghouat', 'Laghouat', 'الأغواط', 850, 650],
  ['04', 'Oum El Bouaghi', 'Oum El Bouaghi', 'أم البواقي', 600, 450],
  ['05', 'Batna', 'Batna', 'باتنة', 800, 550],
  ['06', 'Bejaia', 'Bejaia', 'بجاية', 800, 550],
  ['07', 'Biskra', 'Biskra', 'بسكرة', 850, 650],
  ['08', 'Bechar', 'Bechar', 'بشار', 950, 750],
  ['09', 'Blida', 'Blida', 'البليدة', 800, 550],
  ['10', 'Bouira', 'Bouira', 'البويرة', 800, 550],
  ['11', 'Tamanrasset', 'Tamanrasset', 'تمنراست', 1500, 1300],
  ['12', 'Tebessa', 'Tebessa', 'تبسة', 800, 550],
  ['13', 'Tlemcen', 'Tlemcen', 'تلمسان', 800, 550],
  ['14', 'Tiaret', 'Tiaret', 'تيارت', 800, 550],
  ['15', 'Tizi Ouzou', 'Tizi Ouzou', 'تيزي وزو', 800, 550],
  ['16', 'Algiers', 'Alger', 'الجزائر', 600, 450],
  ['17', 'Djelfa', 'Djelfa', 'الجلفة', 850, 650],
  ['18', 'Jijel', 'Jijel', 'جيجل', 600, 450],
  ['19', 'Setif', 'Setif', 'سطيف', 800, 550],
  ['20', 'Saida', 'Saida', 'سعيدة', 800, 550],
  ['21', 'Skikda', 'Skikda', 'سكيكدة', 600, 450],
  ['22', 'Sidi Bel Abbes', 'Sidi Bel Abbes', 'سيدي بلعباس', 800, 550],
  ['23', 'Annaba', 'Annaba', 'عنابة', 800, 550],
  ['24', 'Guelma', 'Guelma', 'قالمة', 600, 450],
  ['25', 'Constantine', 'Constantine', 'قسنطينة', 490, 350],
  ['26', 'Medea', 'Medea', 'المدية', 800, 550],
  ['27', 'Mostaganem', 'Mostaganem', 'مستغانم', 800, 550],
  ['28', 'Msila', 'Msila', 'المسيلة', 800, 550],
  ['29', 'Mascara', 'Mascara', 'معسكر', 800, 550],
  ['30', 'Ouargla', 'Ouargla', 'ورقلة', 850, 650],
  ['31', 'Oran', 'Oran', 'وهران', 800, 550],
  ['32', 'El Bayadh', 'El Bayadh', 'البيض', 950, 750],
  ['33', 'Illizi', 'Illizi', 'إليزي', 1500, 1300],
  ['34', 'Bordj Bou Arreridj', 'Bordj Bou Arreridj', 'برج بوعريريج', 800, 550],
  ['35', 'Boumerdes', 'Boumerdes', 'بومرداس', 800, 550],
  ['36', 'El Tarf', 'El Tarf', 'الطارف', 800, 550],
  ['37', 'Tindouf', 'Tindouf', 'تندوف', 1500, 1300],
  ['38', 'Tissemsilt', 'Tissemsilt', 'تيسمسيلت', 800, 550],
  ['39', 'El Oued', 'El Oued', 'الوادي', 850, 650],
  ['40', 'Khenchela', 'Khenchela', 'خنشلة', 800, 550],
  ['41', 'Souk Ahras', 'Souk Ahras', 'سوق أهراس', 800, 550],
  ['42', 'Tipaza', 'Tipaza', 'تيبازة', 800, 550],
  ['43', 'Mila', 'Mila', 'ميلة', 600, 450],
  ['44', 'Ain Defla', 'Ain Defla', 'عين الدفلى', 800, 550],
  ['45', 'Naama', 'Naama', 'النعامة', 950, 750],
  ['46', 'Ain Temouchent', 'Ain Temouchent', 'عين تموشنت', 800, 550],
  ['47', 'Ghardaia', 'Ghardaia', 'غرداية', 850, 650],
  ['48', 'Relizane', 'Relizane', 'غليزان', 800, 550],
  ['49', 'Timimoun', 'Timimoun', 'تيميمون', 950, 750],
  ['50', 'Bordj Badji Mokhtar', 'Bordj Badji Mokhtar', 'برج باجي مختار', 950, 750],
  ['51', 'Ouled Djellal', 'Ouled Djellal', 'أولاد جلال', 850, 650],
  ['52', 'Beni Abbes', 'Beni Abbes', 'بني عباس', 950, 750],
  ['53', 'In Salah', 'In Salah', 'عين صالح', 1500, 1300],
  ['54', 'In Guezzam', 'In Guezzam', 'عين قزام', 1500, 1300],
  ['55', 'Touggourt', 'Touggourt', 'توقرت', 850, 650],
  ['56', 'Djanet', 'Djanet', 'جانت', 1500, 1300],
  ['57', 'El Mghair', 'El Mghair', 'المغير', 850, 650],
  ['58', 'El Meniaa', 'El Meniaa', 'المنيعة', 850, 650]
] as const;

async function main() {
  const passwordHash = await hash('Admin@12345', 10);

  await prisma.user.upsert({
    where: {email: 'admin@noire.dz'},
    update: {name: 'Admin', passwordHash},
    create: {name: 'Admin', email: 'admin@noire.dz', passwordHash}
  });

  for (const [code, nameEn, nameFr, nameAr, homePriceDzd, stopdeskPriceDzd] of wilayas) {
    await prisma.shippingWilaya.upsert({
      where: {code},
      update: {nameEn, nameFr, nameAr, homePriceDzd, stopdeskPriceDzd},
      create: {
        code,
        nameEn,
        nameFr,
        nameAr,
        homePriceDzd,
        stopdeskPriceDzd
      }
    });
  }

  await prisma.siteSettings.upsert({
    where: {id: 'main'},
    update: {},
    create: {
      id: 'main',
      storeName: 'Noire',
      trackingEnabled: false
    }
  });

  const sampleProducts = [
    {
      slug: 'legacy-tailored-pant',
      category: 'pants',
      titleEn: 'Legacy Tailored Pant',
      titleFr: 'Pantalon Legacy Coupe',
      titleAr: '????? ??????',
      descriptionEn: 'Structured premium pants for clean silhouettes.',
      descriptionFr: 'Pantalon premium structure pour une silhouette nette.',
      descriptionAr: '????? ???? ???? ????? ??????.',
      priceDzd: 9800,
      stock: 24,
      featured: true,
      image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1200'
    },
    {
      slug: 'studio-oversized-tee',
      category: 'tshirts',
      titleEn: 'Studio Oversized Tee',
      titleFr: 'T-shirt Studio Oversize',
      titleAr: '???? ?????? ????',
      descriptionEn: 'Heavy cotton oversized t-shirt with minimalist branding.',
      descriptionFr: 'T-shirt oversize en coton epais avec branding minimal.',
      descriptionAr: '???? ???? ???? ????? ????? ????? ????.',
      priceDzd: 5200,
      stock: 40,
      featured: true,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1200'
    },
    {
      slug: 'mono-runner-shoes',
      category: 'shoes',
      titleEn: 'Mono Runner Shoes',
      titleFr: 'Chaussures Mono Runner',
      titleAr: '???? ???? ????',
      descriptionEn: 'Monochrome sneaker for all-day movement.',
      descriptionFr: 'Sneaker monochrome confortable toute la journee.',
      descriptionAr: '???? ????? ????? ???? ?????? ???????.',
      priceDzd: 14900,
      stock: 18,
      featured: true,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200'
    }
  ] as const;

  for (const product of sampleProducts) {
    const created = await prisma.product.upsert({
      where: {slug: product.slug},
      update: {
        category: product.category,
        titleEn: product.titleEn,
        titleFr: product.titleFr,
        titleAr: product.titleAr,
        descriptionEn: product.descriptionEn,
        descriptionFr: product.descriptionFr,
        descriptionAr: product.descriptionAr,
        priceDzd: product.priceDzd,
        stock: product.stock,
        featured: product.featured,
        published: true
      },
      create: {
        slug: product.slug,
        category: product.category,
        titleEn: product.titleEn,
        titleFr: product.titleFr,
        titleAr: product.titleAr,
        descriptionEn: product.descriptionEn,
        descriptionFr: product.descriptionFr,
        descriptionAr: product.descriptionAr,
        priceDzd: product.priceDzd,
        stock: product.stock,
        featured: product.featured,
        published: true,
        images: {
          create: [
            {
              url: product.image,
              altEn: product.titleEn,
              altFr: product.titleFr,
              altAr: product.titleAr,
              sortOrder: 0
            }
          ]
        },
        variants: {
          create: ['S', 'M', 'L', 'XL'].flatMap((size) =>
            ['#000000', '#FFFFFF'].map((color) => ({size, color, stock: 4}))
          )
        }
      }
    });

    await prisma.variant.deleteMany({where: {productId: created.id}});
    await prisma.variant.createMany({
      data: ['S', 'M', 'L', 'XL'].flatMap((size) =>
        ['#000000', '#FFFFFF'].map((color) => ({productId: created.id, size, color, stock: 4}))
      )
    });
    await prisma.product.update({
      where: {id: created.id},
      data: {stock: 32}
    });
  }

  console.log('Seed complete');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
