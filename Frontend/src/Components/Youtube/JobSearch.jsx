import React, { useState } from 'react';
import { FiSearch, FiExternalLink, FiBriefcase, FiMapPin, FiClock, FiDollarSign } from 'react-icons/fi';

function JobSearch() {
  const [category, setCategory] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    if (!category.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs?category=${category}`);
      const data = await res.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 py-4">
      

      <div className="bg-white rounded-xl shadow-lg p-6 mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Job title, keywords, or company"
              className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onKeyPress={(e) => e.key === 'Enter' && fetchJobs()}
            />
          </div>
          <button
            onClick={fetchJobs}
            disabled={loading}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <FiSearch /> Search Jobs
              </>
            )}
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center my-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-indigo-100 rounded-full mb-4"></div>
            <div className="h-4 bg-indigo-100 rounded w-32 mb-2"></div>
            <div className="h-4 bg-indigo-100 rounded w-24"></div>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100"
          >
            <a
              href={job.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img
                      src={job.logo || 'https://via.placeholder.com/50'}
                      alt={job.company}
                      className="w-12 h-12 object-contain rounded-lg border border-gray-200 p-1"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/50';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h2>
                    <p className="text-gray-700 font-medium mb-2">{job.company}</p>
                    
                    <div className="flex flex-wrap gap-3 mt-3">
                      <span className="inline-flex items-center text-sm text-gray-600">
                        <FiMapPin className="mr-1" /> {job.location}
                      </span>
                      {job.duration && (
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <FiClock className="mr-1" /> {job.duration}
                        </span>
                      )}
                      {job.stipend && (
                        <span className="inline-flex items-center text-sm text-gray-600">
                          <FiDollarSign className="mr-1" /> {job.stipend}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {job.category || 'General'}
                  </span>
                  <span className="text-indigo-600 text-sm font-medium flex items-center">
                    View Details <FiExternalLink className="ml-1" />
                  </span>
                </div>
              </div>
            </a>
          </div>
        ))}
      </div>

      {!loading && jobs.length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
            <FiBriefcase className="text-indigo-500 text-3xl" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Try searching with different keywords or check back later for new opportunities
          </p>
        </div>
      )}
    </div>
  );
}

export default JobSearch;