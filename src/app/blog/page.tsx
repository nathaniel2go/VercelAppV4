"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import SideBar from "../sidebar";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  thumbnail?: string;
  tags: string[];
  readTime: string;
}

export default function Blog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  useEffect(() => {
    if (!loading && posts.length > 0) {
      // Animate title
      gsap.fromTo(titleRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      // Animate blog cards
      const cards = gridRef.current?.children;
      if (cards) {
        gsap.fromTo(Array.from(cards), 
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.6, 
            stagger: 0.1,
            delay: 0.3,
            ease: "power2.out" 
          }
        );
      }
    }
  }, [loading, posts]);

  const handleCardClick = (slug: string) => {
    window.location.href = `/blog/${slug}`;
  };

  return (
    <div className="relative bg-black text-white min-h-screen font-[family-name:var(--font-geist-sans)]">
      <SideBar />
      
      <div 
        ref={containerRef}
        className="relative z-10 p-8 pt-16"
        style={{ transform: 'translateX(-80px)' }}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <h1 
            ref={titleRef}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-wide"
          >
            Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Stories, tutorials, and insights from my photography journey
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && (
          <div 
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
          >
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group cursor-pointer bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 hover:border-zinc-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                onClick={() => handleCardClick(post.slug)}
              >
                {/* Thumbnail */}
                <div className="aspect-video overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      // Fallback to a gradient if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    }}
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
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
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
              </article>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-400">No blog posts found.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}