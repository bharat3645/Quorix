import React, { useState } from 'react';
import { Search, MapPin, Users, Star, Building2, Globe, TrendingUp } from 'lucide-react';

interface Company {
  id: number;
  name: string;
  description: string;
  location: string;
  size: string;
  industry: string;
  website: string;
  logo: string;
  rating: number;
  openJobs: number;
  founded: number;
  featured: boolean;
  tags: string[];
}

interface CompaniesPageProps {
  onNavigate: (view: string) => void;
}

const companiesData: Company[] = [
  {
    id: 1,
    name: "TechCorp Inc.",
    description: "Leading technology company specializing in cloud computing and AI solutions. We're building the future of enterprise software.",
    location: "San Francisco, CA",
    size: "1000-5000",
    industry: "Technology",
    website: "https://techcorp.com",
    logo: "TC",
    rating: 4.8,
    openJobs: 23,
    founded: 2010,
    featured: true,
    tags: ["Cloud Computing", "AI", "Enterprise Software"]
  },
  {
    id: 2,
    name: "StartupXYZ",
    description: "Fast-growing fintech startup revolutionizing digital payments and financial services for the next generation.",
    location: "New York, NY",
    size: "50-200",
    industry: "Fintech",
    website: "https://startupxyz.com",
    logo: "SX",
    rating: 4.6,
    openJobs: 8,
    founded: 2018,
    featured: false,
    tags: ["Fintech", "Payments", "Mobile Apps"]
  },
  {
    id: 3,
    name: "CloudTech Solutions",
    description: "Infrastructure and DevOps specialists helping companies scale their cloud operations efficiently and securely.",
    location: "Remote",
    size: "200-500",
    industry: "Cloud Services",
    website: "https://cloudtech.com",
    logo: "CT",
    rating: 4.7,
    openJobs: 15,
    founded: 2015,
    featured: true,
    tags: ["DevOps", "Cloud Infrastructure", "Security"]
  },
  {
    id: 4,
    name: "DataFlow Inc.",
    description: "Data analytics and machine learning company providing insights for Fortune 500 companies worldwide.",
    location: "Austin, TX",
    size: "500-1000",
    industry: "Data Analytics",
    website: "https://dataflow.com",
    logo: "DF",
    rating: 4.5,
    openJobs: 12,
    founded: 2012,
    featured: false,
    tags: ["Data Science", "Machine Learning", "Analytics"]
  },
  {
    id: 5,
    name: "MobileFirst Co.",
    description: "Mobile app development agency creating award-winning iOS and Android applications for global brands.",
    location: "Seattle, WA",
    size: "100-300",
    industry: "Mobile Development",
    website: "https://mobilefirst.com",
    logo: "MF",
    rating: 4.4,
    openJobs: 6,
    founded: 2016,
    featured: false,
    tags: ["Mobile Apps", "iOS", "Android", "UX Design"]
  },
  {
    id: 6,
    name: "GreenTech Innovations",
    description: "Sustainable technology company developing clean energy solutions and environmental monitoring systems.",
    location: "Portland, OR",
    size: "300-700",
    industry: "Clean Technology",
    website: "https://greentech.com",
    logo: "GT",
    rating: 4.9,
    openJobs: 18,
    founded: 2008,
    featured: true,
    tags: ["Clean Energy", "IoT", "Environmental Tech"]
  }
];

export function CompaniesPage({ onNavigate }: CompaniesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'jobs' | 'name'>('rating');

  const filteredCompanies = companiesData
    .filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           company.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesIndustry = !industryFilter || company.industry === industryFilter;
      const matchesSize = !sizeFilter || company.size === sizeFilter;
      
      return matchesSearch && matchesIndustry && matchesSize;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'jobs':
          return b.openJobs - a.openJobs;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const industries = [...new Set(companiesData.map(c => c.industry))];
  const sizes = [...new Set(companiesData.map(c => c.size))];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Companies</h1>
          <p className="text-gray-600">
            Discover great companies to work for. {filteredCompanies.length} companies hiring.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Add Your Company
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Industries</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
          
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Sizes</option>
            {sizes.map(size => (
              <option key={size} value={size}>{size} employees</option>
            ))}
          </select>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="rating">Highest Rated</option>
            <option value="jobs">Most Jobs</option>
            <option value="name">Company Name</option>
          </select>
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer ${
            company.featured ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg text-white text-lg flex items-center justify-center font-bold">
                  {company.logo}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    {company.name}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>{company.rating}</span>
                  </div>
                </div>
              </div>
              {company.featured && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">
              {company.description}
            </p>
            
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>{company.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{company.size} employees</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>{company.industry}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Founded {company.founded}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mb-4">
              {company.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-green-600">
                {company.openJobs} open positions
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View Jobs →
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or browse all companies.
          </p>
        </div>
      )}

      {/* Company Spotlight */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="font-semibold text-purple-900 mb-2">Company Spotlight</h3>
        <p className="text-sm text-purple-800 mb-4">
          Featured companies are actively hiring and offer exceptional work environments for developers.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {companiesData.filter(c => c.featured).slice(0, 3).map(company => (
            <div key={company.id} className="bg-white rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded text-white text-sm flex items-center justify-center font-bold">
                  {company.logo}
                </div>
                <span className="font-medium text-gray-900">{company.name}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{company.openJobs} open positions</p>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                <span className="text-xs text-gray-600">{company.rating} rating</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}