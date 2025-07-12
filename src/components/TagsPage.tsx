import React, { useState } from 'react';
import { Search, TrendingUp, Hash } from 'lucide-react';
import { Tag } from '../types';

interface TagsPageProps {
  tags: Tag[];
  onTagClick: (tagName: string) => void;
}

export function TagsPage({ tags, onTagClick }: TagsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'new'>('popular');

  const filteredTags = tags
    .filter(tag => 
      tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.count - a.count;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'new':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const formatCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}m`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Tags</h1>
          <p className="text-gray-600">
            A tag is a keyword or label that categorizes your question with other, similar questions.
            Using the right tags makes it easier for others to find and answer your question.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="popular">Popular</option>
            <option value="name">Name</option>
            <option value="new">Newest</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTags.map((tag) => (
          <div
            key={tag.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onTagClick(tag.name)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-blue-600" />
                <span className="inline-flex items-center px-2 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                  {tag.name}
                </span>
              </div>
              {tag.trending && (
                <TrendingUp className="h-4 w-4 text-green-500" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-3">
              {tag.description}
            </p>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{formatCount(tag.count)} questions</span>
              <span>{tag.todayCount} asked today</span>
            </div>
          </div>
        ))}
      </div>

      {filteredTags.length === 0 && (
        <div className="text-center py-12">
          <Hash className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tags found</h3>
          <p className="text-gray-500">
            Try adjusting your search query or browse all tags.
          </p>
        </div>
      )}

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">About Tags</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p>• Tags are keywords that describe the topic of your question</p>
          <p>• Choose tags that best describe your question to help others find it</p>
          <p>• You can use up to 5 tags per question</p>
          <p>• Popular tags have more active community members who can help</p>
        </div>
      </div>
    </div>
  );
}