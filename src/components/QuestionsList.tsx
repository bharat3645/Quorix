import React from 'react';
import { Plus, ChevronUp, ChevronDown, MessageCircle, Eye, Clock, TrendingUp } from 'lucide-react';
import { Question, User } from '../types';

interface QuestionsListProps {
  questions: Question[];
  onQuestionClick: (question: Question) => void;
  onAskQuestion: () => void;
  onVote: (questionId: number, voteType: 'up' | 'down') => void;
  currentUser: User | null;
  sortBy: 'newest' | 'active' | 'unanswered' | 'votes';
  onSortChange: (sort: 'newest' | 'active' | 'unanswered' | 'votes') => void;
}

export function QuestionsList({ 
  questions, 
  onQuestionClick, 
  onAskQuestion, 
  onVote, 
  currentUser,
  sortBy,
  onSortChange 
}: QuestionsListProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  const getSortIcon = (sort: string) => {
    switch (sort) {
      case 'newest': return <Clock className="h-4 w-4" />;
      case 'active': return <TrendingUp className="h-4 w-4" />;
      case 'votes': return <ChevronUp className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {sortBy === 'unanswered' ? 'Unanswered Questions' : 'All Questions'}
          </h1>
          <span className="text-gray-500">{questions.length.toLocaleString()} questions</span>
        </div>
        
        <button
          onClick={onAskQuestion}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span>Ask Question</span>
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          {[
            { key: 'newest', label: 'Newest' },
            { key: 'active', label: 'Active' },
            { key: 'unanswered', label: 'Unanswered' },
            { key: 'votes', label: 'Most Votes' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => onSortChange(key as any)}
              className={`flex items-center space-x-1 px-3 py-2 rounded text-sm font-medium transition-colors ${
                sortBy === key
                  ? 'bg-orange-100 text-orange-800 border border-orange-200'
                  : 'text-gray-600 hover:bg-gray-100 border border-transparent'
              }`}
            >
              {getSortIcon(key)}
              <span>{label}</span>
            </button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          Sorted by {sortBy}
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
          <p className="text-gray-500 mb-4">
            {sortBy === 'unanswered' 
              ? "All questions have been answered! Great job community." 
              : "Be the first to ask a question in this community."
            }
          </p>
          <button
            onClick={onAskQuestion}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Ask the first question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex space-x-4">
                <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 min-w-0">
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => onVote(question.id, 'up')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      disabled={!currentUser}
                    >
                      <ChevronUp className="h-4 w-4 text-gray-400 hover:text-orange-500" />
                    </button>
                    <span className="font-medium text-gray-900">{question.votes}</span>
                    <button
                      onClick={() => onVote(question.id, 'down')}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      disabled={!currentUser}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-400 hover:text-orange-500" />
                    </button>
                  </div>
                  <div className="text-xs text-center">votes</div>
                </div>
                
                <div className="flex flex-col items-center space-y-1 text-sm text-gray-500 min-w-0">
                  <div className={`flex items-center space-x-1 px-2 py-1 rounded ${
                    question.answers > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                  }`}>
                    <MessageCircle className="h-3 w-3" />
                    <span className="font-medium">{question.answers}</span>
                  </div>
                  <div className="text-xs">answers</div>
                </div>
                
                <div className="flex flex-col items-center space-y-1 text-sm text-gray-500 min-w-0">
                  <div className="flex items-center space-x-1">
                    <Eye className="h-3 w-3" />
                    <span className="font-medium">{formatNumber(question.views)}</span>
                  </div>
                  <div className="text-xs">views</div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 
                    className="text-lg font-medium text-blue-600 hover:text-blue-800 cursor-pointer line-clamp-2 mb-2 transition-colors"
                    onClick={() => onQuestionClick(question)}
                  >
                    {question.title}
                  </h3>
                  
                  {question.body && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {question.body.substring(0, 200)}...
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {question.tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <span>asked {formatDate(question.createdAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-semibold">
                        {question.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                        {question.author}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}