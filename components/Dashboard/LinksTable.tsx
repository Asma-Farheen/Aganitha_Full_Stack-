'use client';

import { useState } from 'react';
import type { Link } from '@/app/page';

interface LinksTableProps {
    links: Link[];
    loading: boolean;
    onLinkDeleted: () => void;
}

export function LinksTable({ links, loading, onLinkDeleted }: LinksTableProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this link?')) return;

        try {
            setDeletingId(id);
            const response = await fetch(`/api/links/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                onLinkDeleted();
            } else {
                alert('Failed to delete link');
            }
        } catch (error) {
            console.error('Error deleting link:', error);
            alert('An error occurred');
        } finally {
            setDeletingId(null);
        }
    };

    const handleCopy = async (code: string, id: string) => {
        const shortUrl = `${window.location.origin}/${code}`;
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleVisit = (code: string) => {
        window.open(`/${code}`, '_blank');
    };

    const formatDate = (date: string | null) => {
        if (!date) return 'Never';
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="glass-panel rounded-xl p-8">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-3 text-slate-400">Loading links...</span>
                </div>
            </div>
        );
    }

    if (links.length === 0) {
        return (
            <div className="glass-panel rounded-xl p-8">
                <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    <h3 className="mt-4 text-base font-medium text-slate-300">No links yet</h3>
                    <p className="mt-1 text-sm text-slate-500">Get started by creating your first short link above.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700/50">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th scope="col" className="px-4 sm:px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Short Code
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Target URL
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Clicks
                            </th>
                            <th scope="col" className="hidden md:table-cell px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Created
                            </th>
                            <th scope="col" className="hidden lg:table-cell px-6 py-3.5 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Last Clicked
                            </th>
                            <th scope="col" className="px-4 sm:px-6 py-3.5 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {links.map((link) => (
                            <tr key={link.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <code className="text-sm font-mono text-purple-400 bg-slate-900/50 px-2 py-1 rounded border border-slate-700/50">
                                            /{link.code}
                                        </code>
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4">
                                    <div className="text-sm text-slate-300 max-w-[120px] sm:max-w-xs md:max-w-sm truncate" title={link.targetUrl}>
                                        {link.targetUrl}
                                    </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                                        {link.clicks}
                                    </span>
                                </td>
                                <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                    {formatDate(link.createdAt)}
                                </td>
                                <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                    {formatDate(link.lastClicked)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleCopy(link.code, link.id)}
                                            className="p-2 text-slate-400 hover:text-purple-400 transition-colors rounded-lg hover:bg-slate-700/50"
                                            title="Copy short URL"
                                        >
                                            {copiedId === link.id ? (
                                                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleVisit(link.code)}
                                            className="p-2 text-slate-400 hover:text-blue-400 transition-colors rounded-lg hover:bg-slate-700/50"
                                            title="Visit link"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(link.id)}
                                            disabled={deletingId === link.id}
                                            className="p-2 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50 disabled:opacity-50"
                                            title="Delete link"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}