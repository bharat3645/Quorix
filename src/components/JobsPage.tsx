import React, { useState } from 'react';
import { Search, MapPin, DollarSign, Clock, Building2, Users, Star, Filter } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  description: string;
  tags: string[];
  postedAt: Date;
  featured: boolean;
  remote: boolean;
}

interface JobsPageProps {
  onNavigate: (view: string) => void;
}

const jobsData: Job[] = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $180k",
    type: "Full-time",
    experience: "5+ years",
    description: "We're looking for a senior full stack developer to join our growing team. You'll work on cutting-edge web applications using React, Node.js, and cloud technologies.",
    tags: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    featured: true,
    remote: true
  },
  {
    id: 2,
    title: "Frontend Engineer",
    company: "StartupXYZ",
    location: "New York, NY",
    salary: "$90k - $130k",
    type: "Full-time",
    experience: "3+ years",
    description: "Join our frontend team to build beautiful, responsive user interfaces. Experience with modern JavaScript frameworks required.",
    tags: ["Vue.js", "JavaScript", "CSS", "HTML", "Figma"],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    featured: false,
    remote: false
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Remote",
    salary: "$100k - $150k",
    type: "Full-time",
    experience: "4+ years",
    description: "Help us scale our infrastructure and improve deployment processes. Experience with Kubernetes and CI/CD pipelines essential.",
    tags: ["Kubernetes", "Docker", "AWS", "Terraform", "Jenkins"],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    featured: true,
    remote: true
  },
  {
    id: 4,
    title: "Python Backend Developer",
    company: "DataFlow Inc.",
    location: "Austin, TX",
    salary: "$85k - $120k",
    type: "Full-time",
    experience: "2+ years",
    description: "Build scalable backend services and APIs. Strong Python skills and database experience required.",
    tags: ["Python", "Django", "PostgreSQL", "Redis", "API"],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    featured: false,
    remote: true
  },
  {
    id: 5,
    title: "Mobile App Developer",
    company: "MobileFirst Co.",
    location: "Seattle, WA",
    salary: "$95k - $140k",
    type: "Full-time",
    experience: "3+ years",
    description: "Develop cross-platform mobile applications using React Native. App Store deployment experience preferred.",
    tags: ["React Native", "iOS", "Android", "JavaScript", "Firebase"],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    featured: false,
    remote: false
  }
];

export function JobsPage({ onNavigate }: JobsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const filteredJobs = jobsData.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = !locationFilter || job.location.toLowerCase().includes(locationFilter.toLowerCase());
    const matchesType = !typeFilter || job.type === typeFilter;
    const matchesRemote = !remoteOnly || job.remote;
    
    return matchesSearch && matchesLocation && matchesType && matchesRemote;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    return `${diffInDays} days ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Developer Jobs</h1>
          <p className="text-gray-600">
            Find your next opportunity in tech. {filteredJobs.length} jobs available.
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
          Post a Job
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Remote only</span>
          </label>
        </div>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className={`bg-white border rounded-lg p-6 hover:shadow-md transition-shadow ${
            job.featured ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
          }`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">
                    {job.title}
                  </h3>
                  {job.featured && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center space-x-1">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{job.company}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{job.salary}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{job.type}</span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4 line-clamp-2">
                  {job.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="ml-6 text-right">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors mb-2">
                  Apply Now
                </button>
                <div className="text-sm text-gray-500">
                  Posted {formatDate(job.postedAt)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">
            Try adjusting your search criteria or browse all available positions.
          </p>
        </div>
      )}

      {/* Job Alerts */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Get job alerts</h3>
        <p className="text-sm text-blue-800 mb-4">
          Create a job alert and receive email notifications when new jobs matching your criteria are posted.
        </p>
        <div className="flex space-x-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
            Create Alert
          </button>
        </div>
      </div>
    </div>
  );
}