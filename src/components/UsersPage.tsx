import React, { useState } from 'react';
import { Search, MapPin, Calendar, Trophy, Star } from 'lucide-react';
import { User } from '../types';

interface UsersPageProps {
  users: User[];
  onUserClick: (user: User) => void;
}

export function UsersPage({ users, onUserClick }: UsersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'reputation' | 'newest' | 'name'>('reputation');

  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'reputation':
          return b.reputation - a.reputation;
        case 'newest':
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const formatReputation = (rep: number) => {
    if (rep >= 1000000) return `${(rep / 1000000).toFixed(1)}m`;
    if (rep >= 1000) return `${(rep / 1000).toFixed(1)}k`;
    return rep.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const getReputationColor = (reputation: number) => {
    if (reputation >= 10000) return 'text-purple-600';
    if (reputation >= 5000) return 'text-blue-600';
    if (reputation >= 1000) return 'text-green-600';
    return 'text-gray-600';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">
            Browse our community of developers and find experts in your field.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
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
            <option value="reputation">Reputation</option>
            <option value="newest">Newest</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onUserClick(user)}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-lg flex items-center justify-center font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate hover:text-blue-600 transition-colors">
                  {user.name}
                </h3>
                <div className={`flex items-center space-x-1 ${getReputationColor(user.reputation)}`}>
                  <Trophy className="h-4 w-4" />
                  <span className="font-medium">{formatReputation(user.reputation)}</span>
                </div>
              </div>
            </div>

            {user.bio && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {user.bio}
              </p>
            )}

            <div className="space-y-2 text-sm text-gray-500">
              {user.location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{user.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(user.joinedAt)}</span>
              </div>

              {user.topTags && user.topTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {user.topTags.slice(0, 3).map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                  {user.topTags.length > 3 && (
                    <span className="text-xs text-gray-400">+{user.topTags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="font-semibold text-gray-900">{user.questionsAsked || 0}</div>
                  <div className="text-xs text-gray-500">questions</div>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{user.answersGiven || 0}</div>
                  <div className="text-xs text-gray-500">answers</div>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="font-semibold text-gray-900">{user.badges || 0}</span>
                  </div>
                  <div className="text-xs text-gray-500">badges</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">
            Try adjusting your search query or browse all users.
          </p>
        </div>
      )}

      <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-2">Join Our Community</h3>
        <p className="text-sm text-green-800 mb-3">
          Stack Overflow is a community of millions of developers helping each other solve coding problems.
        </p>
        <div className="text-sm text-green-800 space-y-1">
          <p>• Ask questions and get expert answers</p>
          <p>• Share your knowledge by answering questions</p>
          <p>• Build your reputation and earn badges</p>
          <p>• Connect with developers worldwide</p>
        </div>
      </div>
    </div>
  );
}