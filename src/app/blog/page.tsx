import fs from 'fs';
import path from 'path';
import SideBar from '../sidebar';

interface BlogPostFrontmatter { title?: string; description?: string; date?: string; tags?: string[]; thumbnail?: string; readTime?: string; }
interface BlogPost { slug: string; title: string; description: string; date: string; tags: string[]; thumbnail?: string; readTime: string; }

const contentDir = path.join(process.cwd(), 'src', 'app', 'blog', 'content', 'blog');

function parseFrontmatter(raw: string): { data: BlogPostFrontmatter; body: string } {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const fm = match[1];
  const body = match[2];
  const data: BlogPostFrontmatter = {};
  fm.split('\n').forEach(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (value.startsWith('[') && value.endsWith(']')) (data as any)[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
    else (data as any)[key] = value;
  });
  return { data, body };
}

function calcReadTime(body: string) { const words = body.trim().split(/\s+/).length; return `${Math.max(1, Math.ceil(words/200))} min read`; }

function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(contentDir)) return [];
  return fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.md'))
    .map(f => {
      const slug = f.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(contentDir, f), 'utf8');
      const { data, body } = parseFrontmatter(raw);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        date: data.date || new Date().toISOString().split('T')[0],
        tags: Array.isArray(data.tags) ? data.tags : [],
        thumbnail: data.thumbnail || '/blog/thumbnails/default.jpg',
        readTime: data.readTime || calcReadTime(body)
      } as BlogPost;
    })
    .sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="relative bg-black text-white min-h-screen font-[family-name:var(--font-geist-sans)]">
      <SideBar />
      
      <div 
        className="relative z-10 p-8 pt-16"
        style={{ transform: 'translateX(-80px)' }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-wide">
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stories, tutorials, and insights from my photography journey
          </p>
        </div>

        {/* Blog Grid */}
        {posts.length > 0 && (
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Meta Information */}
                  <div className="mb-3">
                    <span className="text-sm text-gray-400">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold mb-3 text-left group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p
                    className="text-gray-300 text-sm leading-relaxed mb-4"
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-zinc-800 text-xs rounded-full text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No blog posts found.</p>
          </div>
        )}
      </div>

    </div>
  );
}