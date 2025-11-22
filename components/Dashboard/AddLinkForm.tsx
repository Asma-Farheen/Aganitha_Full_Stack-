'use client';

import { useState } from 'react';

interface AddLinkFormProps {
    onLinkCreated: () => void;
}

export function AddLinkForm({ onLinkCreated }: AddLinkFormProps) {
    const [targetUrl, setTargetUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl,
                    customCode: customCode || undefined,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTargetUrl('');
                setCustomCode('');
                onLinkCreated();
                setTimeout(() => setSuccess(false), 3000);
            } else {
                setError(data.error || 'Failed to create link');
            }
        } catch (err) {
            setError('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel rounded-xl p-8">
            <div className="flex items-center gap-2.5 mb-2">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Create Short Link</h2>
            </div>
            <p className="text-sm text-slate-400 mb-7">Generate a short, memorable link for your URL</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Target URL <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            value={targetUrl}
                            onChange={(e) => setTargetUrl(e.target.value)}
                            placeholder="https://example.com/your-long-url"
                            required
                            className="w-full h-11 px-3.5 py-2.5 text-sm border border-slate-700 bg-slate-900/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none placeholder-slate-500 transition backdrop-blur-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Custom Code <span className="text-slate-500 text-xs font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            value={customCode}
                            onChange={(e) => setCustomCode(e.target.value)}
                            placeholder="my-custom-link"
                            pattern="[A-Za-z0-9]{6,8}"
                            className="w-full h-11 px-3.5 py-2.5 text-sm border border-slate-700 bg-slate-900/50 text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none font-mono placeholder-slate-500 transition backdrop-blur-sm"
                        />
                    </div>
                </div>

                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-3.5">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-3.5">
                        <p className="text-green-400 text-sm">✓ Link created successfully!</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-2.5 bg-linear-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white text-sm font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/30"
                >
                    {loading ? 'Creating...' : 'Create Short Link'}
                </button>
            </form>
        </div>
    );
}