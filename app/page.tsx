'use client';

import { useState, useEffect } from 'react';
import { AddLinkForm } from '@/components/Dashboard/AddLinkForm';
import { LinksTable } from '@/components/Dashboard/LinksTable';
import { SearchFilter } from '@/components/Dashboard/SearchFilter';

export interface Link {
  id: string;
  code: string;
  targetUrl: string;
  clicks: number;
  createdAt: string;
  lastClicked: string | null;
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>([]);
  const [filteredLinks, setFilteredLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLinks = async (isBackground = false) => {
    try {
      if (!isBackground) {
        setLoading(true);
      }
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
        // Only update filtered links if we're not searching, or if we want to update stats in real-time
        // If user is searching, we should probably re-apply the filter to the new data
        // But for now, let's just update the main state and let the useEffect handle the filtering
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      if (!isBackground) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchLinks();

    // Auto-refresh every 5 seconds to update click counts
    const interval = setInterval(() => {
      fetchLinks(true); // Pass true for background refresh
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredLinks(links);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = links.filter(
        (link) =>
          link.code.toLowerCase().includes(query) ||
          link.targetUrl.toLowerCase().includes(query)
      );
      setFilteredLinks(filtered);
    }
  }, [searchQuery, links]);

  const handleLinkCreated = () => {
    fetchLinks();
  };

  const handleLinkDeleted = () => {
    fetchLinks();
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-header sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 w-full">
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">TinyLink</h1>
              <p className="text-xs text-slate-400 font-medium">Professional URL Shortener</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="grow w-full max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-8">
          {/* Create Link Form */}
          <div className="w-full">
            <AddLinkForm onLinkCreated={handleLinkCreated} />
          </div>

          {/* Links Section */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 glass-panel p-4 rounded-xl backdrop-blur-sm">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  Your Links
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {links.length}
                  </span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">Manage and track your short links</p>
              </div>
              <SearchFilter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>

            <LinksTable links={filteredLinks} loading={loading} onLinkDeleted={handleLinkDeleted} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-6 mt-auto bg-slate-900/20 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} TinyLink. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}