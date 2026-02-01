import React from 'react';
import { Settings, Wrench, Activity, AlertCircle } from 'lucide-react';

const SparePartItem = ({ part }) => {
    // Mock calculation for health based on usage (just for visuals)
    // Assuming higher usage = lower health for this demo, or usage is % used.
    // Let's assume usage is "Months used" and max life is 12 months.
    const maxLife = 60; // Just a mock max usage number
    const healthPercent = Math.max(0, 100 - (part.usage / maxLife) * 100);

    let barColor = "bg-emerald-500";
    if (healthPercent < 30) barColor = "bg-red-500";
    else if (healthPercent < 70) barColor = "bg-amber-500";

    return (
        <div className="flex items-center gap-4 p-4 bg-slate-900/30 border border-white/5 rounded-xl hover:bg-slate-800/50 transition-colors group">
            <div className="p-3 bg-slate-950 rounded-lg text-slate-400 group-hover:text-cyan-400 transition-colors">
                <Settings className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-slate-200">{part.name}</span>
                    <span className="text-xs font-mono text-slate-500">{healthPercent.toFixed(0)}% Health</span>
                </div>
                <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${barColor} shadow-[0_0_10px_currentColor]`}
                        style={{ width: `${healthPercent}%` }}
                    />
                </div>
            </div>
            <div className="text-right">
                <div className="text-xs text-slate-500 uppercase tracking-wider">Usage</div>
                <div className="text-lg font-mono font-bold text-white">{part.usage} <span className="text-xs text-slate-500">cyc</span></div>
            </div>
        </div>
    );
};

const ActivityItem = ({ log, index }) => {
    // Mock category detection
    const category = log.action.includes('Software') ? 'SYSTEM' : 'MECHANICAL';
    const badgeColor = category === 'SYSTEM' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/30';

    return (
        <div className="relative pl-8 pb-8 last:pb-0 border-l border-white/10 ml-2">
            <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-600 ring-4 ring-slate-950" />

            <div className="flex flex-col gap-1 -mt-1.5">
                <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badgeColor}`}>
                        {category}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{log.date}</span>
                </div>
                <span className="text-sm font-medium text-slate-200 mt-1">{log.action}</span>
                <span className="text-xs text-slate-500">Tech: {log.technician}</span>
            </div>
        </div>
    );
};

const AnalyticsTier = ({ spareParts = [], logs = [] }) => {
    return (
        <section className="h-[31%] w-full flex gap-6 px-6 pb-2">

            {/* Spare Components Matrix */}
            <div className="flex-1 glass-panel rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                    <Wrench className="w-5 h-5 text-purple-400" />
                    <h2 className="text-lg font-bold text-white tracking-wide">COMPONENT HEALTH MATRIX</h2>
                </div>
                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                    {spareParts.map((part) => (
                        <SparePartItem key={part.id} part={part} />
                    ))}
                </div>
            </div>

            {/* System Activity Feed */}
            <div className="w-[35%] glass-panel rounded-2xl p-6 flex flex-col">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                    <Activity className="w-5 h-5 text-blue-400" />
                    <h2 className="text-lg font-bold text-white tracking-wide">LIVE ACTIVITY FEED</h2>
                </div>
                <div className="flex-1 overflow-hidden pt-2">
                    {logs.slice(0, 3).map((log, index) => (
                        <ActivityItem key={log.id} log={log} index={index} />
                    ))}
                </div>
            </div>

        </section>
    );
};

export default AnalyticsTier;
