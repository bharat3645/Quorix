import React, { useState } from 'react';
import { Search, Users, Star, TrendingUp, MessageCircle, Eye, Calendar } from 'lucide-react';

interface Collective {
  id: number;
  name: string;
  description: string;
  category: string;
  members: number;
  questions: number;
  answers: number;
  tags: string[];
  featured: boolean;
  trending: boolean;
  createdAt: Date;
  moderators: string[];
  logo: string;
}

interface CollectivesPageProps {
  onNavigate: (view: string) => void;
}

const collectivesData: Collective[] = [
  {
    id: 1,
    name: "React Developers",
    description: "A community for React developers to share knowledge, best practices, and help each other build amazing user interfaces.",
    category: "Frontend",
    members: 15420,
    questions: 2340,
    answers: 8760,
    tags: ["react", "jsx", "hooks", "components"],
    featured: true,
    trending: true,
    createdAt: new Date('2020-03-15'),
    moderators: ["Alex Johnson", "Sarah Chen"],
    logo: "RD"
  },
  {
    id: 2,
    name: "Python Data Science",
    description: "Explore data science, machine learning, and analytics with Python. Share insights, datasets, and collaborate on projects.",
    category: "Data Science",
    members: 23750,
    questions: 3456,
    answers: 12890,
    tags: ["python", "pandas", "numpy", "scikit-learn", "tensorflow"],
    featured: true,
    trending: false,
    createdAt: new Date('2019-07-22'),
    moderators: ["Dr. Emily Watson", "Mike Rodriguez"],
    logo: "PD"
  },
  {
    id: 3,
    name: "DevOps & Cloud",
    description: "Best practices for DevOps, cloud infrastructure, CI/CD, and modern deployment strategies.",
    category: "Infrastructure",
    members: 12340,
    questions: 1890,
    answers: 5670,
    tags: ["devops", "aws", "docker", "kubernetes", "terraform"],
    featured: false,
    trending: true,
    createdAt: new Date('2021-01-10'),
    moderators: ["David Wilson", "Lisa Park"],
    logo: "DC"
  },
  {
    id: 4,
    name: "Mobile Development",
    description: "iOS, Android, and cross-platform mobile development community. Share apps, code, and mobile UX insights.",
    category: "Mobile",
    members: 9876,
    questions: 1234,
    answers: 4567,
    tags: ["ios", "android", "react-native", "flutter", "swift"],
    featured: false,
    trending: false,
    createdAt: new Date('2020-05-18'),
    moderators: ["Anna Thompson", "Robert Kim"],
    logo: "MD"
  },
  {
    id: 5,
    name: "Web Security",
    description: "Cybersecurity for web applications, ethical hacking, penetration testing, and security best practices.",
    category: "Security",
    members: 8920,
    questions: 987,
    answers: 3210,
    tags: ["security", "penetration-testing", "owasp", "cryptography"],
    featured: true,
    trending: true,
    createdAt: new Date('2019-11-03'),
    moderators: ["Maria Garcia", "James Miller"],
    logo: "WS"
  },
  {
    id: 6,
    name: "AI & Machine Learning",
    description: "Artificial intelligence, deep learning, neural networks, and cutting-edge ML research and applications.",
    category: "AI/ML",
    members: 18650,
    questions: 2890,
    answers: 9870,
    tags: ["machine-learning", "deep-learning", "ai", "neural-networks"],
    featured: true,
    trending: true,
    createdAt: new Date('2018-09-14'),
    moderators: ["Dr. Chen Liu", "Prof. Sarah Johnson"],
    logo: "AI"
  }
];

export function CollectivesPage({ onNavigate }: CollectivesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sortBy, setSortBy] = useState<'members' | 'activity' | 'newest'>('members');

  const filteredCollectives = collectivesData
    .filter(collective => {
      const matchesSearch = collective.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collective.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           collective.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !categoryFilter || collective.category === categoryFilter;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'members':
          return b.members - a.members;
        case 'activity':
          return (b.questions + b.answers) - (a.questions + a.answers);
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

  const categories = [...new Set(collectivesData.map(c => c.category))];

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Collectives</h1>
          <p className="text-gray-600">
            Join specialized communities of developers sharing knowledge and expertise.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Create Collective
        </button>
      </div>

      {/* Featured Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">Join the Community</h2>
        <p className="text-blue-100 mb-4">
          Collectives are focused communities where developers collaborate on specific technologies and topics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{collectivesData.reduce((sum, c) => sum + c.members, 0).toLocaleString()}</div>
            <div className="text-blue-100">Total Members</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{collectivesData.reduce((sum, c) => sum + c.questions, 0).toLocaleString()}</div>
            <div className="text-blue-100">Questions Asked</div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <div className="text-2xl font-bold">{collectivesData.reduce((sum, c) => sum + c.answers, 0).toLocaleString()}</div>
            <div className="text-blue-100">Answers Provided</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search collectives..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="members">Most Members</option>
            <option value="activity">Most Active</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Collectives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCollectives.map((collective) => (
          <div key={collective.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${
            collective.featured ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-lg flex items-center justify-center font-bold">
                  {collective.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {collective.name}
                  </h3>
                  <span className="text-sm text-gray-500">{collective.category}</span>
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                {collective.featured && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Featured
                  </span>
                )}
                {collective.trending && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </span>
                )}
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {collective.description}
            </p>
            
            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
              <div>
                <div className="flex items-center justify-center space-x-1 text-sm font-semibold text-gray-900">
                  <Users className="h-4 w-4" />
                  <span>{formatNumber(collective.members)}</span>
                </div>
                <div className="text-xs text-gray-500">members</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-sm font-semibold text-gray-900">
                  <MessageCircle className="h-4 w-4" />
                  <span>{formatNumber(collective.questions)}</span>
                </div>
                <div className="text-xs text-gray-500">questions</div>
              </div>
              <div>
                <div className="flex items-center justify-center space-x-1 text-sm font-semibold text-gray-900">
                  <Eye className="h-4 w-4" />
                  <span>{formatNumber(collective.answers)}</span>
                </div>
                <div className="text-xs text-gray-500">answers</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {collective.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>Created {formatDate(collective.createdAt)}</span>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                Join
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCollectives.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No collectives found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or browse all collectives.
          </p>
        </div>
      )}

      {/* Create Collective CTA */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <h3 className="font-semibold text-green-900 mb-2">Start Your Own Collective</h3>
        <p className="text-sm text-green-800 mb-4">
          Have expertise in a specific technology or domain? Create a collective to build a community around your knowledge.
        </p>
        <div className="flex items-center space-x-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors">
            Create Collective
          </button>
          <button className="text-green-600 hover:text-green-800 text-sm font-medium">
            Learn More →
          </button>
        </div>
      </div>
    </div>
  );
}