'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatRelativeTime, formatDate, copyToClipboard } from '@/lib/utils';
import { Link } from '@/app/page';

export default function StatsPage() {
    const params = useParams();
    const router = useRouter();
    const code = params.code as string;

    const [link, setLink] = useState<Link | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchLink = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/links/${code}`);
                if (response.ok) {
                    const data = await response.json();
                    setLink(data);
                } else {
                    setError(true);
                }
            } catch (err) {
                console.error('Error fetching link:', err);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchLink();
    }, [code]);

    const handleCopy = async () => {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
        const shortUrl = `${baseUrl}/${code}`;
        const success = await copyToClipboard(shortUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="w-full max-w-4xl">
                    <div className="glass-panel rounded-2xl p-8">
                        <div className="animate-pulse space-y-8">
                            <div className="h-8 w-48 bg-slate-700/50 rounded"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-32 bg-slate-700/50 rounded-xl"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !link) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="text-center glass-panel p-12 rounded-2xl max-w-lg w-full">
                    <h1 className="text-6xl font-bold text-purple-400 mb-4">404</h1>
                    <p className="text-slate-400 text-xl mb-8">Link not found</p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 bg-linear-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const shortUrl = `${baseUrl}/${code}`;

    return (
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 animate-fadeIn">
                    <button
                        onClick={() => router.push('/')}
                        className="text-purple-400 hover:text-purple-300 mb-4 flex items-center gap-2 transition-colors font-medium"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold text-white tracking-tight">
                        Link Statistics
                    </h1>
                </div>

                {/* Stats Cards */}
                <div className="glass-panel rounded-2xl p-8 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Short Code */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-slate-400 text-sm font-medium">Short Code</h3>
                                <button
                                    onClick={handleCopy}
                                    className="text-purple-400 hover:text-purple-300 transition-colors"
                                    title="Copy short URL"
                                >
                                    {copied ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{link.code}</p>
                            <p className="text-sm text-slate-500 break-all">{shortUrl}</p>
                        </div>

                        {/* Target URL */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="text-slate-400 text-sm font-medium mb-2">Target URL</h3>
                            <a
                                href={link.targetUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-lg font-semibold text-blue-400 hover:text-blue-300 break-all transition-colors"
                            >
                                {link.targetUrl}
                            </a>
                        </div>

                        {/* Total Clicks */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="text-slate-400 text-sm font-medium mb-2">Total Clicks</h3>
                            <div className="flex items-center gap-3">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                                <p className="text-4xl font-bold text-white">{link.clicks}</p>
                            </div>
                        </div>

                        {/* Last Clicked */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="text-slate-400 text-sm font-medium mb-2">Last Clicked</h3>
                            <p className="text-2xl font-bold text-white mb-1">
                                {formatRelativeTime(link.lastClicked)}
                            </p>
                            {link.lastClicked && (
                                <p className="text-sm text-slate-500">
                                    {formatDate(link.lastClicked)}
                                </p>
                            )}
                        </div>

                        {/* Created At */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
                            <h3 className="text-slate-400 text-sm font-medium mb-2">Created</h3>
                            <p className="text-lg font-semibold text-white">
                                {formatDate(link.createdAt)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
