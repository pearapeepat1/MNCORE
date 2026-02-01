import React from 'react';
import { Settings, Wrench, Activity, Database, Cpu } from 'lucide-react';

const SparePartItem = ({ part }) => {
    // Logic for health bar color
    // Determine color based on usage thresholds
    const maxLife = 60; // Mock max usage
    const healthPercent = Math.max(0, 100 - (part.usage / maxLife) * 100);

    let barColor = "bg-emerald-500 shadow-[0_0_10px_#10b981]";
    let statusText = "HEALTHY";
    let statusTextColor = "text-emerald-400";

    if (healthPercent < 30) {
        barColor = "bg-red-500 shadow-[0_0_10px_#ef4444]";
        statusText = "CRITICAL";
        statusTextColor = "text-red-500";
    } else if (healthPercent < 70) {
        barColor = "bg-amber-500 shadow-[0_0_10px_#f59e0b]";
        statusText = "WARNING";
        statusTextColor = "text-amber-400";
    }

    return (
        <div className="flex items-center gap-4 p-4 bg-slate-900/30 border border-white/5 rounded-xl hover:bg-slate-800/60 transition-all duration-300 group">
            {/* Icon Block */}
            <div className="p-3 bg-slate-950 rounded-lg text-slate-500 group-hover:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all">
                <Cpu className="w-5 h-5" />
            </div>

            {/* Main Info */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors tracking-wide">
                        {part.name}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${statusTextColor} uppercase tracking-widest`}>
                        {healthPercent.toFixed(0)}% • {statusText}
                    </span>
                </div>

                {/* Neon Progress Bar */}
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden flex items-center">
                    <div
                        className={`h-full ${barColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
            </div>

            {/* Usage Stat */}
            <div className="text-right pl-4 border-l border-white/5">
                <div className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Cycles</div>
                <div className="text-lg font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {part.usage}
                </div>
            </div>
        </div>
    );
};

const ActivityItem = ({ log, index }) => {
    // Categorization Logic
    const category = log.action.includes('Software') || log.action.includes('Update') ? 'SYSTEM' : 'MECHANICAL';

    // Node Color
    const nodeColor = category === 'SYSTEM' ? 'bg-blue-500 shadow-[0_0_10px_#3b82f6]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]';
    const lineColor = category === 'SYSTEM' ? 'bg-blue-500/20' : 'bg-amber-500/20';

    return (
        <div className="relative pl-8 pb-8 last:pb-0 group">
            {/* Timeline Line */}
            {index !== 2 && ( // Hide line for last item approx
                <div className={`absolute left-[3px] top-2 bottom-0 w-[2px] ${lineColor}`}></div>
            )}

            {/* Glowing Node */}
            <div className={`absolute -left-[1px] top-1.5 w-2.5 h-2.5 rounded-full ${nodeColor} ring-4 ring-[#020617] group-hover:scale-125 transition-transform duration-300`} />

            <div className="flex flex-col gap-1 -mt-0.5">
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] font-black font-mono tracking-widest ${category === 'SYSTEM' ? 'text-blue-400' : 'text-amber-400'}`}>
                        [{category}]
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{log.date}</span>
                </div>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors cursor-default">
                    {log.action}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-600"></div>
                    <span className="text-xs text-slate-500 font-mono">Tech: <span className="text-slate-400">{log.technician}</span></span>
                </div>
            </div>
        </div>
    );
};

const AnalyticsTier = ({ spareParts = [], logs = [] }) => {
    return (
        <section className="h-[31%] w-full flex gap-6 px-6 pb-6 pt-2">

            {/* Spare Components Matrix */}
            <div className="flex-1 relative flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden group">
                {/* Header with gradient line */}
                <div className="relative px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <Database className="w-4 h-4 text-purple-400" />
                        <h2 className="text-sm font-bold text-white tracking-[0.2em] uppercase">Spare Parts Health</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-6 pr-4 scrollbar-hide">
                    {spareParts.map((part) => (
                        <SparePartItem key={part.id} part={part} />
                    ))}
                </div>
            </div>

            {/* System Activity Feed (Neural Link Style) */}
            <div className="w-[35%] relative flex flex-col bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden">
                <div className="relative px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <h2 className="text-sm font-bold text-white tracking-[0.2em] uppercase">System Activity</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden p-6 pt-6">
                    {logs.slice(0, 3).map((log, index) => (
                        <ActivityItem key={log.id} log={log} index={index} />
                    ))}
                </div>
            </div>

        </section>
    );
};

export default AnalyticsTier;
