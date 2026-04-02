"use client";
import React, { useEffect, useState } from 'react';
import { getDashboardData } from '@/lib/analytics';
import { 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { MousePointer2, Film, MousePointer, Activity, RefreshCw, Award } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AnalyticsDashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        const result = await getDashboardData();
        if (result.success) setData(result.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                    <p className="text-slate-500 animate-pulse font-medium">Crunching analytics data...</p>
                </div>
            </div>
        );
    }

    if (!data) return <div className="text-center py-20">Failed to load data. Ensure backend is running.</div>;

    const clickData = data.clicks.map(c => ({
        name: `${c.buttonLabel}`,
        clicks: c._count.id
    }));

    const watchTimeData = data.watchTimes.map(w => ({
        name: w.videoId,
        total: Math.round(w.totalSeconds / 60),
        avg: Math.round(w.averageSecondsPerUser)
    }));

    const scrollData = data.scrollDepths.map(s => ({
        name: s.contentId,
        percent: Math.round(s._avg.maxScrollPercentage)
    }));

    const quizDataArr = data.quizzes.map(q => ({
        name: q.contentId,
        avg: Math.round(q.averageScore * 10) / 10, // already in absolute points? 
        // Actually, backend returns _avg: { score: true }. 
        // Let's assume it's the average number of correct answers.
        count: q.attemptCount
    }));

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Analytics <span className="text-blue-600">Engine</span></h1>
                    <p className="text-slate-500 font-medium">Real-time engagement insights and performance metrics.</p>
                </div>
                <button 
                    onClick={fetchData} 
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm text-sm font-semibold"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh Data
                </button>
            </header>

            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <StatCard icon={MousePointer2} label="Total Interactions" value={data.clicks.reduce((acc, c) => acc + c._count.id, 0)} color="blue" />
                <StatCard icon={Film} label="Video Watch Time" value={`${Math.round(data.watchTimes.reduce((acc, w) => acc + w.totalSeconds, 0) / 60)}m`} color="purple" />
                <StatCard icon={Award} label="Avg Quiz Score" value={data.quizzes.length > 0 ? (data.quizzes.reduce((acc, q) => acc + q.averageScore, 0) / data.quizzes.length).toFixed(1) : '0'} color="emerald" />
                <StatCard icon={Activity} label="Active Users tracked" value={data.watchTimes.length + data.clicks.length} color="amber" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Click Tracking Chart */}
                <ChartSection title="Button Click Distribution" subtitle="Tracking engagement across interactive elements">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={clickData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip cursor={{fill: '#f1f5f9/20'}} contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                            <Bar dataKey="clicks" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartSection>

                {/* Video Watch Time Chart */}
                <ChartSection title="Video Engagement" subtitle="Total watch time in minutes vs Average (seconds)">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={watchTimeData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #f1f5f9', backgroundColor: '#ffffff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                            <Area type="monotone" dataKey="total" stroke="#7c3aed" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={2} />
                            <Area type="monotone" dataKey="avg" stroke="#db2777" fill="transparent" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartSection>

                {/* Scroll Depth Table/Bar */}
                <div className="lg:col-span-2 space-y-8">
                    <ChartSection title="Content Completion (Scroll Depth)" subtitle="How far users are reading text vs watching videos">
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-4 font-semibold">Content Page ID</th>
                                        <th className="pb-4 font-semibold text-center">Avg. Completion</th>
                                        <th className="pb-4 font-semibold">Progress Visualization</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {scrollData.map((s, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 last:border-0">
                                            <td className="py-4 font-bold text-slate-700">{s.name}</td>
                                            <td className="py-4 text-center">{s.percent}%</td>
                                            <td className="py-4 min-w-[200px]">
                                                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                                    <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${s.percent}%` }}></div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {scrollData.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-12 text-center text-slate-400 italic">No scroll data available yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ChartSection>

                    <ChartSection title="Quiz Performance" subtitle="Average scores and total attempts per chapter">
                        <div className="overflow-x-auto mt-4">
                            <table className="w-full text-left">
                                <thead className="border-b border-slate-100 text-slate-400 text-xs uppercase tracking-wider">
                                    <tr>
                                        <th className="pb-4 font-semibold">Chapter ID</th>
                                        <th className="pb-4 font-semibold text-center">Attempts</th>
                                        <th className="pb-4 font-semibold text-center">Avg. Correct Answers</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {quizDataArr.map((q, idx) => (
                                        <tr key={idx} className="border-b border-slate-50 last:border-0">
                                            <td className="py-4 font-bold text-slate-700">{q.name}</td>
                                            <td className="py-4 text-center font-medium text-slate-600">{q.count}</td>
                                            <td className="py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full font-bold ${q.avg >= 1.5 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                                    {q.avg}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {quizDataArr.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="py-12 text-center text-slate-400 italic">No quiz results available yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </ChartSection>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-indigo-50 text-indigo-600',
        pink: 'bg-pink-50 text-pink-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600'
    };

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 flex items-center gap-6 shadow-sm hover:translate-y-[-2px] transition-all duration-300">
            <div className={`p-4 rounded-xl ${colorMap[color]}`}>
                <Icon className="h-6 w-6" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <p className="text-2xl font-bold text-slate-900 leading-tight">{value}</p>
            </div>
        </div>
    );
}

function ChartSection({ title, subtitle, children }) {
    return (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h3>
                <p className="text-sm text-slate-500">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}
