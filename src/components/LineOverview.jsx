import React from 'react';
import { Activity, Power, Clock, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const LineOverview = ({ lineData }) => {
    if (!lineData) return null;

    const { status, health, efficiency, lineName, description, currentShift } = lineData;

    // Helpers for Status Styles
    const getStatusStyles = (s) => {
        switch (s.toUpperCase()) {
            case 'RUNNING': return {
                text: 'LINE RUNNING',
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                pulse: 'animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]'
            };
            case 'STOPPED': return {
                text: 'LINE STOPPED',
                color: 'text-rose-500',
                bg: 'bg-rose-500/10',
                border: 'border-rose-500/20',
                pulse: ''
            };
            case 'IDLE': return {
                text: 'LINE IDLE',
                color: 'text-amber-400',
                bg: 'bg-amber-500/10',
                border: 'border-amber-500/20',
                pulse: ''
            };
            default: return {
                text: 'UNKNOWN',
                color: 'text-slate-400',
                bg: 'bg-slate-800',
                border: 'border-slate-700',
                pulse: ''
            };
        }
    };

    const statusStyle = getStatusStyles(status);

    // Efficiency Gauge Data
    const gaugeData = [
        { name: 'value', value: efficiency },
        { name: 'rest', value: 100 - efficiency }
    ];
    const GAUGE_COLORS = [efficiency > 80 ? '#10b981' : efficiency > 50 ? '#f59e0b' : '#ef4444', '#1e293b'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[220px]">

            {/* 1. Line Identity & Live Status (Span 5) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Live Status Banner */}
                <div className={`flex items-center justify-between p-4 rounded-xl border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.pulse} backdrop-blur-sm transition-all duration-500`}>
                    <div className="flex items-center gap-3">
                        <div className={`relative flex h-4 w-4`}>
                            {status === 'Running' && <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400`}></span>}
                            <span className={`relative inline-flex rounded-full h-4 w-4 ${status === 'Running' ? 'bg-emerald-500' : status === 'Stopped' ? 'bg-rose-500' : 'bg-amber-500'}`}></span>
                        </div>
                        <span className={`text-xl font-black tracking-widest ${statusStyle.color}`}>{statusStyle.text}</span>
                    </div>
                    <Activity className={`${statusStyle.color}`} />
                </div>

                {/* Line Details Card */}
                <div className="flex-1 bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-sm backdrop-blur-md flex flex-col justify-center">
                    <h2 className="text-2xl font-bold text-white mb-2">{lineName}</h2>
                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>
                    <div className="flex items-center gap-2 mt-auto text-xs text-blue-300 bg-blue-500/10 py-2 px-3 rounded-lg w-fit border border-blue-500/20">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-semibold tracking-wide uppercase">{currentShift}</span>
                    </div>
                </div>
            </div>

            {/* 2. Overall Health (Span 4) */}
            <div className="lg:col-span-4 bg-slate-900/40 border border-slate-800 rounded-xl p-6 shadow-sm backdrop-blur-md flex flex-col justify-between group hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> Machine Health
                    </h3>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded ${health === 'Good' ? 'text-emerald-400 bg-emerald-500/10' : health === 'Warning' ? 'text-amber-400 bg-amber-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                        {health}
                    </span>
                </div>

                <div className="flex flex-col gap-6 justify-center flex-1">
                    {/* Text indicator */}
                    <div className="text-center">
                        <span className="text-4xl font-black text-white">{health === 'Good' ? '100' : health === 'Warning' ? '75' : '45'}</span>
                        <span className="text-slate-500 text-sm ml-1">/ 100</span>
                    </div>

                    {/* Segmented Bar */}
                    <div className="w-full flex gap-1.5 h-3">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className={`
                            flex-1 rounded-sm transition-all duration-500
                            ${health === 'Good'
                                        ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'
                                        : health === 'Warning'
                                            ? (i < 4 ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'bg-slate-800')
                                            : (i < 2 ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' : 'bg-slate-800')
                                    }
                        `}
                            ></div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 text-center">Predicted health score based on sensor data.</p>
                </div>
            </div>

            {/* 3. Efficiency Gauge (Span 3) */}
            <div className="lg:col-span-3 bg-slate-900/40 border border-slate-800 rounded-xl p-5 shadow-sm backdrop-blur-md flex flex-col items-center justify-center relative">
                <div className="absolute top-4 left-4">
                    <Zap className="w-4 h-4 text-yellow-500" />
                </div>
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider absolute top-4 right-4">OEE</h3>

                <div className="w-full h-[160px] flex items-center justify-center -mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={gaugeData}
                                cx="50%"
                                cy="75%"
                                startAngle={180}
                                endAngle={0}
                                innerRadius={60}
                                outerRadius={75}
                                paddingAngle={0}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={4}
                            >
                                {gaugeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={GAUGE_COLORS[index]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-[65%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center flex flex-col items-center">
                        <span className="text-3xl font-black text-white tracking-tight">{efficiency}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LineOverview;
