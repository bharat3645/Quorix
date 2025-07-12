import React from 'react';
import { Search, MessageSquare, Trophy, Inbox, User, LogOut, LogIn, Bell, HelpCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onNavigate: (view: 'home' | 'question' | 'ask' | 'tags' | 'users' | 'profile' | 'jobs' | 'companies' | 'teams' | 'collectives') => void;
  currentUser: UserType | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Header({ searchQuery, onSearchChange, onNavigate, currentUser, onLogin, onLogout }: HeaderProps) {
  return (
    <header className="bg-white border-t-4 border-orange-400 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-6">
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2 hover:bg-gray-100 px-3 py-2 rounded transition-colors"
            >
              <MessageSquare className="h-6 w-6 text-orange-500" />
              <span className="font-bold text-xl text-gray-800">stack<span className="text-orange-500">overflow</span></span>
            </button>
            
            <nav className="hidden md:flex space-x-1">
              <button 
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded transition-colors"
              >
                Questions
              </button>
              <button 
                onClick={() => onNavigate('jobs')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded transition-colors"
              >
                Jobs
              </button>
              <button 
                onClick={() => onNavigate('companies')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded transition-colors"
              >
                Companies
              </button>
              <button 
                onClick={() => onNavigate('tags')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded transition-colors"
              >
                Tags
              </button>
              <button 
                onClick={() => onNavigate('users')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded transition-colors"
              >
                Users
              </button>
              <button 
                onClick={() => onNavigate('collectives')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-3 py-2 text-sm font-medium rounded transition-colors"
              >
                Collectives
              </button>
            </nav>
          </div>

          <div className="flex-1 max-w-2xl mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search questions, tags, users..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="hidden md:flex items-center space-x-3">
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                    <Inbox className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      1
                    </span>
                  </button>
                  <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                    <Trophy className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {currentUser.reputation > 999 ? '1k+' : currentUser.reputation}
                    </span>
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                    <HelpCircle className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => onNavigate('profile')}
                    className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm transition-colors"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-semibold">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block font-medium">{currentUser.name}</span>
                    <span className="hidden md:block text-xs text-gray-600">{currentUser.reputation}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                <LogIn className="h-4 w-4" />
                <span>Log in</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}