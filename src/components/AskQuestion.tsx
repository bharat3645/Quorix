import React, { useState } from 'react';
import { X, HelpCircle, Lightbulb, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface AskQuestionProps {
  onSubmit: (question: {
    title: string;
    body: string;
    tags: string[];
    author: string;
  }) => void;
  onCancel: () => void;
  currentUser: User | null;
}

export function AskQuestion({ onSubmit, onCancel, currentUser }: AskQuestionProps) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    onSubmit({
      title,
      body,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: currentUser.name
    });
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Login Required</h2>
          <p className="text-yellow-700 mb-4">You must be logged in to ask a question.</p>
          <button
            onClick={onCancel}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Ask a Public Question</h1>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-3">
              <Lightbulb className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Writing a good question</h3>
                <p className="text-blue-800 text-sm mb-3">
                  You're ready to ask a programming-related question and this form will help guide you through the process.
                </p>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Summarize your problem in a one-line title.</li>
                  <li>• Describe your problem in more detail.</li>
                  <li>• Describe what you tried and what you expected to happen.</li>
                  <li>• Add "tags" which help surface your question to members of the community.</li>
                  <li>• Review your question and post it to the site.</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <label htmlFor="title" className="block text-lg font-semibold text-gray-900 mb-2">
                Title
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Be specific and imagine you're asking a question to another person.
              </p>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Is there an R function for finding the index of an element in a vector?"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                required
                minLength={15}
              />
              <div className="mt-2 text-sm text-gray-500">
                {title.length < 15 && title.length > 0 && (
                  <span className="text-red-500">Title must be at least 15 characters.</span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="body" className="block text-lg font-semibold text-gray-900">
                  What are the details of your problem?
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Introduce the problem and expand on what you put in the title. Minimum 30 characters.
              </p>
              
              {showPreview ? (
                <div className="min-h-48 p-4 border border-gray-300 rounded-md bg-gray-50">
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-800">
                      {body || 'Nothing to preview yet...'}
                    </div>
                  </div>
                </div>
              ) : (
                <textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Describe your problem in detail. Include what you've tried, what you expected to happen, and what actually happened."
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                  minLength={30}
                />
              )}
              
              <div className="mt-2 text-sm text-gray-500">
                {body.length < 30 && body.length > 0 && (
                  <span className="text-red-500">Body must be at least 30 characters.</span>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <label htmlFor="tags" className="block text-lg font-semibold text-gray-900 mb-2">
                Tags
              </label>
              <p className="text-sm text-gray-600 mb-3">
                Add up to 5 tags to describe what your question is about. Start typing to see suggestions.
              </p>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g. javascript, python, react (comma separated)"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <div className="mt-2 text-sm text-gray-500">
                Separate multiple tags with commas. At least 1 tag required, maximum 5 tags.
              </div>
              
              {tags && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {tags.split(',').map((tag, index) => {
                    const trimmedTag = tag.trim();
                    if (!trimmedTag) return null;
                    return (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800">
                        {trimmedTag}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md transition-colors font-medium"
                disabled={title.length < 15 || body.length < 30 || !tags.trim()}
              >
                Post Your Question
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-600 hover:text-gray-900 px-4 py-3 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-2">
              <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800 mb-2">Step 1: Draft your question</h4>
                <p className="text-sm text-yellow-700">
                  The community is here to help you with specific programming problems, but we expect you to do your homework first.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">How to Ask</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Search, and research</li>
              <li>• Write a title that summarizes the specific problem</li>
              <li>• Describe the problem before any code</li>
              <li>• Help others reproduce the problem</li>
              <li>• Include all relevant tags</li>
              <li>• Proof-read before posting</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}