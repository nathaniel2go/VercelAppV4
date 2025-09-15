import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail?: string;
  tags: string[];
  readTime: string;
}

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

export async function GET() {
  try {
    if (!fs.existsSync(contentDirectory)) {
      return NextResponse.json([]);
    }

    const fileNames = fs.readdirSync(contentDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(contentDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        
        const { data, content } = parseFrontmatter(fileContents);
        
        return {
          slug,
          title: data.title || 'Untitled',
          description: data.description || '',
          date: data.date || new Date().toISOString().split('T')[0],
          thumbnail: data.thumbnail || '/blog/thumbnails/default.jpg',
          tags: Array.isArray(data.tags) ? data.tags : [],
          readTime: data.readTime || calculateReadTime(content),
        } as BlogPost;
      });

    // Sort posts by date (newest first)
    const sortedPosts = allPostsData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(sortedPosts);
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return NextResponse.json([]);
  }
}