// @ts-nocheck // Loosen types for static export compatibility with Next 15 generics inference
import fs from 'fs';
import path from 'path';
import SideBar from '../../sidebar';

interface BlogPostFrontmatter {
  title?: string;
  description?: string;
  date?: string;
  tags?: string[];
  thumbnail?: string;
  readTime?: string;
}

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  thumbnail?: string;
  readTime: string;
  content: string;
}

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
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (value.startsWith('[') && value.endsWith(']')) {
      (data as any)[key] = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
    } else {
      (data as any)[key] = value;
    }
  });
  return { data, body };
}

function calcReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export function generateStaticParams() {
  if (!fs.existsSync(contentDir)) return [] as { slug: string }[];
  return fs.readdirSync(contentDir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({ slug: f.replace(/\.md$/, '') }));
}

export default function BlogPost({ params }: any) {
  const slug = params.slug;
  const fullPath = path.join(contentDir, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return (
      <div className="relative bg-black text-white min-h-screen">
        <SideBar />
        <div className="max-w-4xl mx-auto px-8 py-16">
          <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-gray-400 mb-8">The blog post you are looking for does not exist.</p>
          <a href="/blog" className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors inline-block">Back to Blog</a>
        </div>
      </div>
    );
  }
  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, body } = parseFrontmatter(raw);
  const post: BlogPost = {
    slug,
    title: data.title || slug,
    description: data.description || '',
    date: data.date || new Date().toISOString().split('T')[0],
    tags: Array.isArray(data.tags) ? data.tags : [],
    thumbnail: data.thumbnail,
    readTime: data.readTime || calcReadTime(body),
    content: body
  };

  return (
    <div className="relative bg-black text-white min-h-screen">
      <SideBar />
      <article className="max-w-4xl mx-auto px-8 py-16" style={{ transform: 'translateX(-80px)' }}>
        <header className="mb-8">
          <a
            href="/blog"
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </a>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-zinc-800 text-sm rounded-full text-gray-300">{tag}</span>
              ))}
            </div>
          )}
        </header>
        <div className="prose prose-invert prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: formatMarkdown(post.content) }} />
      </article>
    </div>
  );
}

function formatMarkdown(content: string): string {
  return content
    .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-8 rounded-lg" />')
    .replace(/\n\n/g, '</p><p class="mb-4">')
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>');
}