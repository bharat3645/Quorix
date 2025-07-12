import React, { useState } from 'react';
import { ArrowLeft, ChevronUp, ChevronDown, Bookmark, Share2, Flag, Edit, MessageCircle, Check } from 'lucide-react';
import { Question, User, Answer } from '../types';

interface QuestionDetailProps {
  question: Question;
  onBack: () => void;
  onVote: (questionId: number, voteType: 'up' | 'down') => void;
  onAddAnswer: (questionId: number, answerText: string) => void;
  currentUser: User | null;
  onUserClick: (user: User) => void;
}

export function QuestionDetail({ question, onBack, onVote, onAddAnswer, currentUser, onUserClick }: QuestionDetailProps) {
  const [answer, setAnswer] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Mock answers for demonstration
  const mockAnswers: Answer[] = question.answers > 0 ? [
    {
      id: 1,
      questionId: question.id,
      body: "Here's a comprehensive solution to your problem. You can achieve this by using the following approach:\n\n```javascript\nfunction solution() {\n  // Your code here\n  return result;\n}\n```\n\nThis method is efficient and follows best practices. Make sure to handle edge cases appropriately.",
      author: "Expert Developer",
      authorId: 2,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      votes: 42,
      accepted: true
    },
    {
      id: 2,
      questionId: question.id,
      body: "Alternative approach that might work better in some cases:\n\n```javascript\nconst alternativeSolution = () => {\n  // Different implementation\n};\n```\n\nThis has better performance characteristics for large datasets.",
      author: "Code Ninja",
      authorId: 3,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      votes: 18,
      accepted: false
    }
  ] : [];

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onAddAnswer(question.id, answer);
      setAnswer('');
      setShowAnswerForm(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Questions</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex space-x-6 mb-6">
          <div className="flex flex-col items-center space-y-2">
            <button 
              onClick={() => onVote(question.id, 'up')}
              className="p-2 hover:bg-orange-100 rounded-full transition-colors group"
              disabled={!currentUser}
            >
              <ChevronUp className="h-8 w-8 text-gray-600 group-hover:text-orange-600" />
            </button>
            <span className="text-2xl font-semibold text-gray-900">{question.votes}</span>
            <button 
              onClick={() => onVote(question.id, 'down')}
              className="p-2 hover:bg-orange-100 rounded-full transition-colors group"
              disabled={!currentUser}
            >
              <ChevronDown className="h-8 w-8 text-gray-600 group-hover:text-orange-600" />
            </button>
            <button 
              onClick={() => setBookmarked(!bookmarked)}
              className={`p-2 hover:bg-gray-100 rounded-full transition-colors mt-2 ${
                bookmarked ? 'text-yellow-600' : 'text-gray-600'
              }`}
            >
              <Bookmark className={`h-6 w-6 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-900 mb-4">{question.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
              <span>Asked {formatDate(question.createdAt)}</span>
              <span>Viewed {question.views.toLocaleString()} times</span>
              <span>Active today</span>
            </div>

            <div className="prose max-w-none mb-6">
              <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {question.body || `This is a detailed question about ${question.title}. The user is asking for help with a specific programming problem and would like a detailed explanation of the solution.

Here's what I've tried so far:
- Researched online documentation
- Attempted several different approaches
- Consulted with colleagues

I'm looking for a comprehensive solution that addresses the core issue while following best practices.`}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </button>
                <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <Flag className="h-4 w-4" />
                  <span>Flag</span>
                </button>
              </div>
              
              <div className="bg-blue-50 p-3 rounded border border-blue-200">
                <div className="text-sm text-gray-600 mb-1">asked {formatDate(question.createdAt)}</div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-semibold">
                    {question.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-blue-600 cursor-pointer hover:text-blue-800">
                      {question.author}
                    </div>
                    <div className="text-xs text-gray-500">1,234 reputation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {mockAnswers.length} Answer{mockAnswers.length !== 1 ? 's' : ''}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Sorted by:</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-sm">
                <option>Highest score (default)</option>
                <option>Date modified (newest first)</option>
                <option>Date created (oldest first)</option>
              </select>
            </div>
          </div>
          
          {mockAnswers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No answers yet. Be the first to answer!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {mockAnswers.map((ans) => (
                <div key={ans.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex space-x-6">
                    <div className="flex flex-col items-center space-y-2">
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <ChevronUp className="h-6 w-6 text-gray-600 hover:text-orange-600" />
                      </button>
                      <span className="text-xl font-semibold text-gray-900">{ans.votes}</span>
                      <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                        <ChevronDown className="h-6 w-6 text-gray-600 hover:text-orange-600" />
                      </button>
                      {ans.accepted && (
                        <div className="p-1 bg-green-100 rounded-full">
                          <Check className="h-6 w-6 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="prose max-w-none mb-4">
                        <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                          {ans.body}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Share</button>
                          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Edit</button>
                          <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Flag</button>
                        </div>
                        <div className={`p-3 rounded border ${
                          ans.accepted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="text-sm text-gray-600 mb-1">answered {formatDate(ans.createdAt)}</div>
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-8 rounded text-white text-xs flex items-center justify-center font-semibold ${
                              ans.accepted ? 'bg-green-500' : 'bg-gray-500'
                            }`}>
                              {ans.author.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className={`text-sm font-medium cursor-pointer hover:opacity-80 ${
                                ans.accepted ? 'text-green-600' : 'text-gray-600'
                              }`}>
                                {ans.author}
                              </div>
                              <div className="text-xs text-gray-500">5,678 reputation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Answer</h3>
          
          {!currentUser ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800 mb-2">You must be logged in to post an answer.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                Log in to answer
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitAnswer}>
              <div className="mb-4">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Write your answer here... Use markdown for formatting."
                  className="w-full h-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
                <div className="mt-2 text-sm text-gray-500">
                  You can use <strong>**bold**</strong>, <em>*italic*</em>, and `code\` formatting.
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                  disabled={!answer.trim()}
                >
                  Post Your Answer
                </button>
                <div className="text-sm text-gray-500">
                  By posting your answer, you agree to our terms of service.
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}