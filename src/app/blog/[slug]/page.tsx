"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SideBar from "../../sidebar";

interface BlogPost {
  slug: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
  description: string;
  thumbnail?: string;
  readTime: string;
}

export default function BlogPost() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      const slug = params.slug as string;
      
      try {
        const response = await fetch(`/api/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Blog post not found');
          } else {
            setError('Failed to load blog post');
          }
          return;
        }
        
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching blog post:', error);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (params.slug) {
      fetchBlogPost();
    }
  }, [params.slug]);

  if (loading) {
    return (
      <div className="relative bg-black text-white min-h-screen">
        <SideBar />
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="relative bg-black text-white min-h-screen">
        <SideBar />
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
            <p className="text-gray-400 mb-8">{error || 'The blog post you are looking for does not exist.'}</p>
            <button
              onClick={() => router.push('/blog')}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-black text-white min-h-screen">
      <SideBar />
      
      <article className="max-w-4xl mx-auto px-8 py-16" style={{ transform: 'translateX(-80px)' }}>
        {/* Header */}
        <header className="mb-8">
          <button
            onClick={() => router.push('/blog')}
            className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </button>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-zinc-800 text-sm rounded-full text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Content */}
        <div 
          className="prose prose-invert prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: formatMarkdownContent(post.content) }}
        />
      </article>
    </div>
  );
}

// Simple markdown to HTML converter for basic formatting
function formatMarkdownContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-2xl font-bold mt-8 mb-4">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-10 mb-6">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-4xl font-bold mt-12 mb-8">$1</h1>')
    // Bold and italic
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="w-full max-w-2xl mx-auto my-8 rounded-lg" />')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4">')
    // Wrap in paragraphs
    .replace(/^/, '<p class="mb-4">')
    .replace(/$/, '</p>');
}