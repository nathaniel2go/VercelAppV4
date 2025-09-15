import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const contentDirectory = path.join(process.cwd(), 'src/app/blog/content/blog');

function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { data: {}, content };
  }
  
  const frontmatter = match[1];
  const bodyContent = match[2];
  
  // Parse YAML-like frontmatter
  const data: any = {};
  frontmatter.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > -1) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      // Handle arrays (tags)
      if (value.startsWith('[') && value.endsWith(']')) {
        data[key] = value.slice(1, -1).split(',').map(item => item.trim().replace(/['"]/g, ''));
      } else {
        data[key] = value;
      }
    }
  });
  
  return { data, content: bodyContent };
}

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    
    if (!fs.existsSync(contentDirectory)) {
      return NextResponse.json({ error: 'Blog directory not found' }, { status: 404 });
    }

    const fullPath = path.join(contentDirectory, `${slug}.md`);
    
    if (!fs.existsSync(fullPath)) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = parseFrontmatter(fileContents);
    
    const blogPost = {
      slug,
      title: data.title || 'Untitled',
      description: data.description || '',
      date: data.date || new Date().toISOString().split('T')[0],
      thumbnail: data.thumbnail || '/blog/thumbnails/default.jpg',
      tags: Array.isArray(data.tags) ? data.tags : [],
      readTime: data.readTime || calculateReadTime(content),
      content: content
    };
    
    return NextResponse.json(blogPost);
  } catch (error) {
    console.error('Error reading blog post:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}