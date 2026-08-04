export default async function sitemap() {
  const baseUrl = 'https://limaskontraktor.com';

  // 1. Halaman Statis Utama
  const staticRoutes = [
    '',
    '/tentang-kami',
    '/layanan',
    '/proyek',
    '/blog',
    '/kontak',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Routes: Proyek (/proyek/[slug])
  let projectRoutes = [];
  try {
    // Kalau kamu pakai database direct (misal Prisma / Mongoose / Drizzle):
    // const projects = await prisma.project.findMany({ select: { slug: true, updatedAt: true } });
    
    // Atau jika lewat fetch API internal:
    const res = await fetch(`${baseUrl}/api/projects`, { 
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const projects = await res.json();
      // Sesuaikan key jika response berupa { data: [...] }
      const projectList = Array.isArray(projects) ? projects : projects.data || [];

      projectRoutes = projectList.map((item) => ({
        url: `${baseUrl}/proyek/${item.slug}`,
        lastModified: item.updatedAt || item.createdAt || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap for projects:', error);
  }

  // 3. Dynamic Routes: Blog Posts (/blog/[slug])
  let blogRoutes = [];
  try {
    const res = await fetch(`${baseUrl}/api/blog-posts`, { 
      next: { revalidate: 3600 } 
    });

    if (res.ok) {
      const posts = await res.json();
      // Sesuaikan key jika response berupa { data: [...] }
      const postList = Array.isArray(posts) ? posts : posts.data || [];

      blogRoutes = postList.map((item) => ({
        url: `${baseUrl}/blog/${item.slug}`,
        lastModified: item.updatedAt || item.createdAt || new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
    }
  } catch (error) {
    console.error('Error generating sitemap for blog-posts:', error);
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}