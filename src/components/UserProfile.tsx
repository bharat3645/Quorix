import React, { useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Trophy, Star, Edit, Mail, Link as LinkIcon, Github } from 'lucide-react';
import { User, Question } from '../types';

interface UserProfileProps {
  user: User;
  questions: Question[];
  onBack: () => void;
  onQuestionClick: (question: Question) => void;
  isCurrentUser: boolean;
}

export function UserProfile({ user, questions, onBack, onQuestionClick, isCurrentUser }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'questions' | 'answers' | 'tags'>('activity');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReputation = (rep: number) => {
    return rep.toLocaleString();
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 25000) return { level: 'Expert', color: 'purple' };
    if (reputation >= 10000) return { level: 'Advanced', color: 'blue' };
    if (reputation >= 5000) return { level: 'Intermediate', color: 'green' };
    if (reputation >= 1000) return { level: 'Beginner', color: 'yellow' };
    return { level: 'New', color: 'gray' };
  };

  const reputationLevel = getReputationLevel(user.reputation);

  const tabs = [
    { id: 'activity', label: 'Activity', count: null },
    { id: 'questions', label: 'Questions', count: questions.length },
    { id: 'answers', label: 'Answers', count: user.answersGiven || 0 },
    { id: 'tags', label: 'Tags', count: user.topTags?.length || 0 }
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-lg text-white text-3xl flex items-center justify-center font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                {user.bio && (
                  <p className="text-blue-100 mb-3 max-w-2xl">{user.bio}</p>
                )}
                <div className="flex items-center space-x-4 text-sm text-blue-100">
                  {user.location && (
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Member since {formatDate(user.joinedAt)}</span>
                  </div>
                  {user.website && (
                    <div className="flex items-center space-x-1">
                      <LinkIcon className="h-4 w-4" />
                      <a href={user.website} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                        Website
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isCurrentUser && (
              <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-md transition-colors">
                <Edit className="h-4 w-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`flex items-center justify-center space-x-2 text-2xl font-bold text-${reputationLevel.color}-600 mb-1`}>
                <Trophy className="h-6 w-6" />
                <span>{formatReputation(user.reputation)}</span>
              </div>
              <div className="text-sm text-gray-500">Reputation</div>
              <div className={`text-xs text-${reputationLevel.color}-600 font-medium`}>
                {reputationLevel.level}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{user.questionsAsked || 0}</div>
              <div className="text-sm text-gray-500">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">{user.answersGiven || 0}</div>
              <div className="text-sm text-gray-500">Answers</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 text-2xl font-bold text-yellow-600 mb-1">
                <Star className="h-6 w-6 fill-current" />
                <span>{user.badges || 0}</span>
              </div>
              <div className="text-sm text-gray-500">Badges</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-1 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-6">
          {activeTab === 'activity' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Asked a question about React hooks</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Answered a JavaScript question</span>
                  <span className="text-xs text-gray-400">1 day ago</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Earned a badge: "Good Question"</span>
                  <span className="text-xs text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions ({questions.length})</h3>
              {questions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No questions asked yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                      <h4 
                        className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer mb-2"
                        onClick={() => onQuestionClick(question)}
                      >
                        {question.title}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{question.votes} votes</span>
                        <span>{question.answers} answers</span>
                        <span>{question.views} views</span>
                        <span>{formatDate(question.createdAt)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {question.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'answers' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Answers ({user.answersGiven || 0})</h3>
              <div className="text-center py-8 text-gray-500">
                <p>Answer history would be displayed here.</p>
              </div>
            </div>
          )}

          {activeTab === 'tags' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Tags</h3>
              {user.topTags && user.topTags.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.topTags.map((tag, index) => (
                    <div key={tag} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                          {tag}
                        </span>
                        <span className="text-sm text-gray-500">#{index + 1}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Score: {Math.floor(Math.random() * 100) + 50}</div>
                        <div>Posts: {Math.floor(Math.random() * 20) + 5}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No tags to display yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}