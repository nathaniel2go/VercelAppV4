import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail?: string;
  tags: string[];
  readTime: string;
  content: string;
}

const contentDirectory = path.join(process.cwd(), 'src/content/blog');

export function getAllBlogPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(contentDirectory)) {
      console.warn('Blog content directory does not exist:', contentDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const { data, content } = matter(fileContents);
        
        return {
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || new Date().toISOString().split('T')[0],
          thumbnail: data.thumbnail || '/blog/thumbnails/default.jpg',
          tags: data.tags || [],
          readTime: data.readTime || calculateReadTime(content),
          content
        } as BlogPost;
      });

    // Sort posts by date (newest first)
    return allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      thumbnail: data.thumbnail || '/blog/thumbnails/default.jpg',
      tags: data.tags || [],
      readTime: data.readTime || calculateReadTime(content),
      content
    } as BlogPost;
  } catch (error) {
    console.error('Error reading blog post:', error);
    return null;
  }
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}