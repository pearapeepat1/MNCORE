import React from 'react';
import { Activity, AlertTriangle, CheckCircle, XCircle, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatusSummary = ({ status, health, efficiency }) => {

    // Status Logic
    const getStatusColor = (s) => {
        switch (s) {
            case 'Running': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/50';
            case 'Idle': return 'text-amber-400 bg-amber-500/10 border-amber-500/50';
            case 'Offline': return 'text-rose-400 bg-rose-500/10 border-rose-500/50';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/50';
        }
    };

    const getStatusIcon = (s) => {
        switch (s) {
            case 'Running': return <Activity className="w-5 h-5 animate-pulse" />;
            case 'Idle': return <AlertTriangle className="w-5 h-5" />;
            case 'Offline': return <XCircle className="w-5 h-5" />;
            default: return <Zap className="w-5 h-5" />;
        }
    };

    // Gauge Data
    const gaugeData = [
        { name: 'value', value: efficiency },
        { name: 'rest', value: 100 - efficiency }
    ];
    const GAUGE_COLORS = [efficiency > 80 ? '#10b981' : efficiency > 50 ? '#f59e0b' : '#ef4444', '#334155'];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 1. Live FA Status */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity`}>
                    <Activity size={100} />
                </div>
                <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-2">Live FA Status</h3>
                <div className={`flex items-center gap-3 px-6 py-3 rounded-full border-2 ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span className="text-xl font-bold">{status}</span>
                </div>
                <p className="text-slate-500 text-xs mt-4">Last updated: Just now</p>
            </div>

            {/* 2. Overall Machine Health */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col justify-center relative">
                <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" /> Overall Machine Health
                </h3>

                <div className="space-y-4">
                    <div className="flex justify-between items-end text-sm">
                        <span className={`font-medium ${health === 'Good' ? 'text-emerald-400' : health === 'Warning' ? 'text-amber-400' : 'text-rose-400'}`}>
                            Current State: <span className="text-lg font-bold">{health}</span>
                        </span>
                    </div>

                    {/* Visual Health Bars */}
                    <div className="flex gap-1 h-3 w-full">
                        <div className={`flex-1 rounded-l-full bg-emerald-500/20 border border-emerald-500/30 ${health === 'Good' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : ''}`}></div>
                        <div className={`flex-1 bg-amber-500/20 border border-amber-500/30 ${health === 'Warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : ''}`}></div>
                        <div className={`flex-1 rounded-r-full bg-rose-500/20 border border-rose-500/30 ${health === 'Critical' ? 'bg-rose-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : ''}`}></div>
                    </div>

                    <div className="flex justify-between text-xs text-slate-500">
                        <span>Good</span>
                        <span>Warning</span>
                        <span>Critical</span>
                    </div>
                </div>
            </div>

            {/* 3. Machine Efficiency Gauge */}
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col items-center justify-center relative">
                <h3 className="text-slate-400 text-sm uppercase tracking-wider font-semibold mb-[-10px] z-10">Efficiency</h3>
                <div className="w-full h-[140px] flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={gaugeData}
                                cx="50%"
                                cy="80%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                            >
                                {gaugeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-3xl font-bold text-slate-100">{efficiency}%</span>
                    </div>
                </div>
                <div className="text-xs text-slate-500 -mt-2">OEE Calculated</div>
            </div>
        </div>
    );
};

export default StatusSummary;
