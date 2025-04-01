import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';

export function EndpointCrawler() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ siteEndpoints: [], jsEndpoints: [] });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url) {
      setError('Please enter a valid URL.');
      return;
    }

    setLoading(true);
    setError('');
    setResults({ siteEndpoints: [], jsEndpoints: [] });

    try {
      const response = await fetch(`/crawl?url=${encodeURIComponent(url)}`); // Use GET instead of POST

      if (!response.ok) {
        throw new Error('Failed to crawl website.');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to crawl website. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Endpoint Crawler
          </h1>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter target URL"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                {loading ? 'Scanning...' : 'Scan'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {(results.siteEndpoints.length > 0 || results.jsEndpoints.length > 0) && (
            <div className="space-y-6">
              {results.siteEndpoints.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    HTML Endpoints
                  </h2>
                  <div className="bg-gray-50 rounded-md p-4">
                    <ul className="space-y-2">
                      {results.siteEndpoints.map((endpoint, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="font-mono">{endpoint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {results.jsEndpoints.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    JavaScript Endpoints
                  </h2>
                  <div className="bg-gray-50 rounded-md p-4">
                    <ul className="space-y-2">
                      {results.jsEndpoints.map((endpoint, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                          <span className="font-mono">{endpoint}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}  
