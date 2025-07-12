import React from 'react';
import { Home, Users, Tag, Star, HelpCircle, Globe, Building, Briefcase, Building2, Layers } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'question' | 'ask' | 'tags' | 'users' | 'profile' | 'jobs' | 'companies' | 'teams' | 'collectives') => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const isActive = (view: string) => currentView === view;

  return (
    <aside className="w-48 bg-gray-50 border-r border-gray-200 min-h-screen sticky top-14">
      <div className="p-4">
        <nav className="space-y-1">
          <button
            onClick={() => onNavigate('home')}
            className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive('home') 
                ? 'bg-orange-100 text-orange-800 border-r-2 border-orange-500' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </button>
          
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Public
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => onNavigate('home')}
                className={`w-full flex items-center justify-between px-6 py-2 text-sm rounded-md transition-colors ${
                  isActive('home') 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="h-4 w-4" />
                  <span>Questions</span>
                </div>
              </button>
              
              <button 
                onClick={() => onNavigate('tags')}
                className={`w-full flex items-center space-x-3 px-6 py-2 text-sm rounded-md transition-colors ${
                  isActive('tags') 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Tag className="h-4 w-4" />
                <span>Tags</span>
              </button>
              
              <button 
                onClick={() => onNavigate('users')}
                className={`w-full flex items-center space-x-3 px-6 py-2 text-sm rounded-md transition-colors ${
                  isActive('users') 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-4 w-4" />
                <span>Users</span>
              </button>
              
              <button 
                onClick={() => onNavigate('companies')}
                className={`w-full flex items-center space-x-3 px-6 py-2 text-sm rounded-md transition-colors ${
                  isActive('companies') 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Building2 className="h-4 w-4" />
                <span>Companies</span>
              </button>
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Collectives
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Layers className="h-4 w-4 text-blue-500" />
                <span>Explore Collectives</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Teams
            </h3>
            <div className="space-y-1">
              <button className="w-full flex items-center space-x-3 px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                <Building className="h-4 w-4" />
                <span>Create free Team</span>
              </button>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Find Jobs
            </h3>
            <div className="space-y-1">
              <button 
                onClick={() => onNavigate('jobs')}
                className={`w-full flex items-center space-x-3 px-6 py-2 text-sm rounded-md transition-colors ${
                  isActive('jobs') 
                    ? 'bg-orange-100 text-orange-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="h-4 w-4" />
                <span>Jobs</span>
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <div className="px-3 space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Globe className="h-3 w-3" />
                <span>Stack Overflow</span>
              </div>
              <div className="text-xs text-gray-400 leading-relaxed">
                Questions, Help, Chat
              </div>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
}