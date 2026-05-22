// prisma/seed.ts
import { PrismaClient, ProjectStatus, TestimonialPlatform } from '../src/generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('ERROR: DATABASE_URL environment variable is not set.');
  process.exit(1);
}

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Clean the database in proper order to respect foreign keys
  await prisma.$transaction([
    prisma.leadsLog.deleteMany(),
    prisma.categoryProject.deleteMany(),
    prisma.blogPostTag.deleteMany(),
    prisma.blogPostCategory.deleteMany(),
    prisma.projectTeam.deleteMany(),
    prisma.testimonial.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.page.deleteMany(),
    prisma.project.deleteMany(),
    prisma.team.deleteMany(),
    prisma.category.deleteMany(),
    prisma.tag.deleteMany(),
    prisma.setting.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // --- Users ---
  const admin = await prisma.user.create({
    data: {
      email: 'admin@limas.co.id',
      password: '$adminlimas', // dummy hash
      name: 'Admin Limas',
      role: 'admin',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@limas.co.id',
      password: 'managerlimas',
      name: 'Sarah Manajer',
      role: 'manager',
    },
  });

  // --- Teams ---
  const team1 = await prisma.team.create({
    data: {
      name: 'Budi Santoso',
      position: 'Project Manager',
      bio: 'Berpengalaman lebih dari 10 tahun di konstruksi.',
      email: 'budi@limas.co.id',
      phone: '081234567890',
      displayOrder: 1,
    },
  });

  const team2 = await prisma.team.create({
    data: {
      name: 'Anisa Rahma',
      position: 'Architect',
      bio: 'Spesialis desain modern dan berkelanjutan.',
      email: 'anisa@limas.co.id',
      phone: '081234567891',
      displayOrder: 2,
    },
  });

  const team3 = await prisma.team.create({
    data: {
      name: 'Dian Pratama',
      position: 'Site Supervisor',
      email: 'dian@limas.co.id',
      displayOrder: 3,
    },
  });

  // --- Categories ---
  const catResidential = await prisma.category.create({
    data: {
      name: 'Residential',
      slug: 'residential',
      type: 'project',
      description: 'Proyek perumahan dan apartemen',
    },
  });

  const catCommercial = await prisma.category.create({
    data: {
      name: 'Commercial',
      slug: 'commercial',
      type: 'project',
      description: 'Perkantoran, pusat perbelanjaan, dan ruko',
    },
  });

  const catIndustrial = await prisma.category.create({
    data: {
      name: 'Industrial',
      slug: 'industrial',
      type: 'project',
      description: 'Pabrik dan gudang',
    },
  });

  const blogCatTech = await prisma.category.create({
    data: {
      name: 'Technology',
      slug: 'technology',
      type: 'blog',
      description: 'Teknologi konstruksi terkini',
    },
  });

  const blogCatTips = await prisma.category.create({
    data: {
      name: 'Tips & Tricks',
      slug: 'tips-tricks',
      type: 'blog',
      description: 'Tips membangun dan renovasi',
    },
  });

  // --- Tags ---
  const tagEco = await prisma.tag.create({
    data: { name: 'Eco-friendly', slug: 'eco-friendly' },
  });

  const tagModern = await prisma.tag.create({
    data: { name: 'Modern', slug: 'modern' },
  });

  const tagSmartHome = await prisma.tag.create({
    data: { name: 'Smart Home', slug: 'smart-home' },
  });

  // --- Projects ---
  const project1 = await prisma.project.create({
    data: {
      title: 'Green Valley Residence',
      slug: 'green-valley-residence',
      description:
        'Cluster perumahan modern dengan konsep hijau dan smart home.',
      location: 'Bogor, Jawa Barat',
      client: 'PT Harmoni Properti',
      limasRole: 'Kontraktor Utama',
      coverImage: '/images/projects/green-valley.jpg',
      gallery: [
        '/images/projects/green-valley-1.jpg',
        '/images/projects/green-valley-2.jpg',
      ],
      status: ProjectStatus.ONGOING,
      seoTitle: 'Green Valley Residence - Limas Karya',
      seoDescription: 'Proyek perumahan hijau modern di Bogor.',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      title: 'Tech Hub Office Tower',
      slug: 'tech-hub-office-tower',
      description: 'Gedung perkantoran 20 lantai dengan sertifikasi green building.',
      location: 'Jakarta Selatan',
      client: 'PT Inovasi Digital',
      limasRole: 'Kontraktor & Desain Interior',
      coverImage: '/images/projects/tech-hub.jpg',
      status: ProjectStatus.COMPLETED,
      seoTitle: 'Tech Hub Office Tower - Portofolio Limas',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      title: 'Sentosa Industrial Park',
      slug: 'sentosa-industrial-park',
      description: 'Kawasan pergudangan dan pabrik terpadu seluas 10 hektar.',
      location: 'Karawang, Jawa Barat',
      client: 'PT Kawasan Industri Sentosa',
      limasRole: 'Kontraktor',
      coverImage: '/images/projects/sentosa.jpg',
      status: ProjectStatus.DRAFT,
    },
  });

  // --- Project teams (many-to-many) ---
  await prisma.projectTeam.createMany({
    data: [
      { projectId: project1.id, teamId: team1.id, role: 'Project Manager' },
      { projectId: project1.id, teamId: team2.id, role: 'Lead Architect' },
      { projectId: project2.id, teamId: team1.id, role: 'Project Director' },
      { projectId: project2.id, teamId: team3.id, role: 'Supervisor' },
      { projectId: project3.id, teamId: team2.id, role: 'Consultant Architect' },
    ],
  });

  // --- Category Projects (many-to-many) ---
  await prisma.categoryProject.createMany({
    data: [
      { categoryId: catResidential.id, projectId: project1.id },
      { categoryId: catCommercial.id, projectId: project2.id },
      { categoryId: catIndustrial.id, projectId: project3.id },
    ],
  });

  // --- Blog Posts ---
  const blog1 = await prisma.blogPost.create({
    data: {
      title: '5 Tren Desain Rumah 2025',
      slug: 'tren-desain-rumah-2025',
      content: '<p>Artikel lengkap tentang tren terbaru...</p>',
      excerpt: 'Simak tren desain rumah yang akan populer tahun ini.',
      coverImage: '/images/blog/tren-2025.jpg',
      seoTitle: 'Tren Desain Rumah 2025 - Blog Limas',
      seoDescription: 'Apa saja tren desain rumah di 2025?',
      published: true,
      publishedAt: new Date('2025-01-15'),
    },
  });

  const blog2 = await prisma.blogPost.create({
    data: {
      title: 'Tips Memilih Kontraktor Terpercaya',
      slug: 'tips-memilih-kontraktor',
      content: '<p>Panduan memilih kontraktor yang tepat...</p>',
      excerpt: 'Agar proyek Anda berjalan lancar, pilih kontraktor dengan kriteria ini.',
      coverImage: '/images/blog/kontraktor.jpg',
      published: false,
    },
  });

  // --- Blog Post Categories ---
  await prisma.blogPostCategory.createMany({
    data: [
      { blogPostId: blog1.id, categoryId: blogCatTips.id },
      { blogPostId: blog2.id, categoryId: blogCatTips.id },
      { blogPostId: blog1.id, categoryId: blogCatTech.id },
    ],
  });

  // --- Blog Post Tags ---
  await prisma.blogPostTag.createMany({
    data: [
      { blogPostId: blog1.id, tagId: tagModern.id },
      { blogPostId: blog1.id, tagId: tagEco.id },
      { blogPostId: blog2.id, tagId: tagSmartHome.id },
    ],
  });

  // --- Pages ---
  await prisma.page.create({
    data: {
      title: 'Tentang Kami',
      slug: 'tentang-kami',
      content: '<h1>Tentang Limas Karya</h1><p>Perusahaan konstruksi terdepan...</p>',
      seoTitle: 'Tentang Limas Karya',
      seoDescription: 'Profil perusahaan konstruksi Limas.',
      published: true,
    },
  });

  await prisma.page.create({
    data: {
      title: 'Karir',
      slug: 'karir',
      content: '<h1>Bergabung dengan Limas</h1><p>Lowongan pekerjaan terbaru...</p>',
      published: false,
    },
  });

  // --- Testimonials ---
  await prisma.testimonial.createMany({
    data: [
      {
        clientName: 'Andi Wijaya',
        content: 'Sangat puas dengan hasil kerja Limas. Proyek selesai tepat waktu dan kualitas prima.',
        rating: 5,
        platform: TestimonialPlatform.MANUAL,
        published: true,
        projectId: project1.id,
      },
      {
        clientName: 'PT Inovasi Digital',
        content: 'Limas memberikan solusi desain interior yang luar biasa untuk kantor kami.',
        rating: 4,
        platform: TestimonialPlatform.SOCIAL_MEDIA,
        sourceUrl: 'https://instagram.com/p/xyz',
        published: true,
        projectId: project2.id,
      },
      {
        clientName: 'Bapak Rudi',
        content: 'Proses pembangunan sangat profesional, komunikasi bagus.',
        rating: 5,
        platform: TestimonialPlatform.MANUAL,
        published: false,
        projectId: project1.id,
      },
    ],
  });

  // --- Leads Logs ---
  await prisma.leadsLog.createMany({
    data: [
      {
        name: 'Dewi Anggraini',
        phone: '081298765432',
        message: 'Saya tertarik dengan cluster Green Valley. Mohon info harga.',
        projectId: project1.id,
        pageUrl: '/projects/green-valley-residence',
        ipAddress: '192.168.1.10',
        userAgent: 'Mozilla/5.0 ...',
      },
      {
        name: 'Rian Firmansyah',
        phone: '082112345678',
        message: 'Apakah bisa renovasi kantor kecil?',
        pageUrl: '/contact',
        ipAddress: '192.168.1.11',
      },
    ],
  });

  // --- Settings ---
  await prisma.setting.createMany({
    data: [
      {
        key: 'site_title',
        value: 'Limas Karya – Kontraktor Profesional',
      },
      {
        key: 'site_description',
        value: 'Membangun masa depan dengan kualitas terbaik.',
      },
      {
        key: 'contact_email',
        value: 'info@limas.co.id',
      },
      {
        key: 'contact_phone',
        value: '021-12345678',
      },
      {
        key: 'social_instagram',
        value: 'https://instagram.com/limaskarya',
      },
    ],
  });

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });