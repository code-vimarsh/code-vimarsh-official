import React from 'react';
import { MOCK_BLOGS } from '../constants';
import { BookOpen } from 'lucide-react';

const Blog: React.FC = () => {
  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <header className="space-y-4">
        <h1 className="text-4xl font-display font-bold">Engineering Blog.</h1>
        <p className="text-textMuted max-w-2xl">Deep technical dives, architecture reviews, and tutorials from the community.</p>
      </header>

      <div className="space-y-8">
        {MOCK_BLOGS.map((post) => (
          <article key={post.id} className="group cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6 items-start bg-surface border border-surfaceLight p-6 rounded-xl hover:border-primary/40 transition-colors">
              <div className="flex-1 space-y-3">
                <div className="flex items-center space-x-3 text-xs font-mono text-textMuted">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.author}</span>
                </div>
                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">{post.title}</h2>
                <p className="text-textMuted leading-relaxed">{post.excerpt}</p>
                
                <div className="flex gap-2 pt-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-bgDark border border-surfaceLight px-2 py-1 rounded text-textMain">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default Blog;