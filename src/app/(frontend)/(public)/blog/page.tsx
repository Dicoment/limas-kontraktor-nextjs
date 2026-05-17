import { prisma } from "@/lib/prisma"

export default async function PublicBlogListPage() {
  const posts = await prisma.blogPost.findMany({
    include: { blogPostCategories: { include: { category: true } }, blogPostTags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  })

  return (
    <div className="min-h-screen py-12 px-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-slate-100 flex items-center justify-center">
              {post.coverImage ? <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" /> : <span className="text-slate-400">No Image</span>}
            </div>
            <div className="p-5 space-y-2">
              <div className="flex gap-2 flex-wrap">
                {(post.blogPostCategories || []).map((cat: any) => (
                  <span key={cat.categoryId} className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">{cat.category.name}</span>
                ))}
              </div>
              <h3 className="font-bold text-slate-800">{post.title}</h3>
              <p className="text-sm text-slate-600 line-clamp-2">{(post.excerpt || post.content).slice(0, 150)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}