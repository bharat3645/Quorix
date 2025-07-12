import React, { useState } from 'react';
import { Users, Plus, Settings, Crown, Shield, Star, Calendar, MessageCircle } from 'lucide-react';

interface Team {
  id: number;
  name: string;
  description: string;
  members: number;
  plan: 'Free' | 'Basic' | 'Business';
  isOwner: boolean;
  role: 'Owner' | 'Admin' | 'Member';
  createdAt: Date;
  questions: number;
  answers: number;
  tags: string[];
}

interface TeamsPageProps {
  onNavigate: (view: string) => void;
  currentUser: any;
}

const teamsData: Team[] = [
  {
    id: 1,
    name: "Frontend Development Team",
    description: "Our team focuses on React, Vue.js, and modern frontend technologies. We share knowledge and collaborate on UI/UX best practices.",
    members: 12,
    plan: 'Business',
    isOwner: true,
    role: 'Owner',
    createdAt: new Date('2023-01-15'),
    questions: 45,
    answers: 128,
    tags: ["react", "vue.js", "css", "javascript"]
  },
  {
    id: 2,
    name: "Backend API Team",
    description: "Server-side development, API design, and database optimization. We work with Node.js, Python, and cloud services.",
    members: 8,
    plan: 'Basic',
    isOwner: false,
    role: 'Admin',
    createdAt: new Date('2023-03-22'),
    questions: 23,
    answers: 67,
    tags: ["node.js", "python", "api", "database"]
  },
  {
    id: 3,
    name: "DevOps & Infrastructure",
    description: "Managing deployments, CI/CD pipelines, and cloud infrastructure. Focus on AWS, Docker, and Kubernetes.",
    members: 6,
    plan: 'Free',
    isOwner: false,
    role: 'Member',
    createdAt: new Date('2023-06-10'),
    questions: 18,
    answers: 34,
    tags: ["devops", "aws", "docker", "kubernetes"]
  }
];

export function TeamsPage({ onNavigate, currentUser }: TeamsPageProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long',
      day: 'numeric'
    });
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Free': return 'text-gray-600 bg-gray-100';
      case 'Basic': return 'text-blue-600 bg-blue-100';
      case 'Business': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Owner': return <Crown className="h-4 w-4 text-yellow-600" />;
      case 'Admin': return <Shield className="h-4 w-4 text-blue-600" />;
      default: return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle team creation logic here
    setShowCreateForm(false);
    setNewTeamName('');
    setNewTeamDescription('');
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <Users className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-yellow-800 mb-2">Login Required</h2>
          <p className="text-yellow-700 mb-4">You must be logged in to view and manage teams.</p>
          <button
            onClick={() => onNavigate('home')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Teams</h1>
          <p className="text-gray-600">
            Collaborate with your team members in private spaces designed for knowledge sharing.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Team</span>
        </button>
      </div>

      {/* Teams Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Your Teams</h3>
              <p className="text-sm text-gray-600">{teamsData.length} teams</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{teamsData.length}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Total Questions</h3>
              <p className="text-sm text-gray-600">Across all teams</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {teamsData.reduce((sum, team) => sum + team.questions, 0)}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Total Answers</h3>
              <p className="text-sm text-gray-600">Across all teams</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {teamsData.reduce((sum, team) => sum + team.answers, 0)}
          </div>
        </div>
      </div>

      {/* Teams List */}
      <div className="space-y-6">
        {teamsData.map((team) => (
          <div key={team.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {team.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(team.role)}
                    <span className="text-sm text-gray-600">{team.role}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(team.plan)}`}>
                    {team.plan}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {team.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {team.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {team.isOwner && (
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{team.members}</div>
                <div className="text-sm text-gray-500">Members</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{team.questions}</div>
                <div className="text-sm text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{team.answers}</div>
                <div className="text-sm text-gray-500">Answers</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center space-x-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(team.createdAt)}</span>
                </div>
                <div className="text-sm text-gray-500">Created</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4">
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Team →
                </button>
                <button className="text-gray-600 hover:text-gray-800 text-sm">
                  Ask Question
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Last activity: 2 hours ago
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Team Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Create New Team</h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleCreateTeam} className="p-6">
              <div className="mb-4">
                <label htmlFor="teamName" className="block text-sm font-medium text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  id="teamName"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="teamDescription"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                  placeholder="Describe your team's purpose and focus"
                  required
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Create Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-600 hover:text-gray-900 px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Empty State */}
      {teamsData.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No teams yet</h3>
          <p className="text-gray-500 mb-4">
            Create your first team to start collaborating with your colleagues.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create Your First Team
          </button>
        </div>
      )}

      {/* Teams Benefits */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Why use Stack Overflow for Teams?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h4 className="font-medium mb-1">Private Knowledge Base</h4>
            <p>Keep your team's knowledge secure and searchable in one place.</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Faster Onboarding</h4>
            <p>New team members can quickly find answers to common questions.</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Reduced Interruptions</h4>
            <p>Less time spent answering the same questions repeatedly.</p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Better Collaboration</h4>
            <p>Share knowledge and best practices across your organization.</p>
          </div>
        </div>
      </div>
    </div>
  );
}