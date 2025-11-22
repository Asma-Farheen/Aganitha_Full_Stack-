'use client';

interface SearchFilterProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function SearchFilter({ searchQuery, onSearchChange }: SearchFilterProps) {
    return (
        <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by code or URL..."
                className="w-full pl-9 pr-4 py-2 border border-slate-700/50 bg-slate-900/50 rounded-lg text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition backdrop-blur-sm"
            />
        </div>
    );
}