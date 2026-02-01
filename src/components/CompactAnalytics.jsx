import React from 'react';
import { Package, ClipboardList, Settings, PenTool, Cpu, AlertCircle, ChevronRight, Zap, Box, Activity, CheckCircle2 } from 'lucide-react';

const CompactAnalytics = ({ spareParts, maintenanceLogs }) => {
    return (
        <div className="h-full w-full grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-0 px-2 sm:px-4 pb-2">

            {/* 1. SPARE COMPONENTS MATRIX (50%) */}
            <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-xl flex flex-col shadow-2xl relative group overflow-hidden">
                {/* Highlight Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600"></div>

                {/* Header */}
                <div className="p-4 lg:p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="text-sm lg:text-base font-black text-white uppercase tracking-[0.15em] flex items-center gap-3 font-sans">
                        <Box size={20} className="text-cyan-400" />
                        Spare Components
                    </h3>
                    <span className="text-[10px] sm:text-xs font-bold text-slate-300 font-mono bg-slate-950/80 px-3 py-1 rounded-lg border border-white/10 shadow-inner">
                        {spareParts?.length || 0} ITEMS
                    </span>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-3 bg-slate-950/30">
                    <div className="space-y-3">
                        {spareParts && spareParts.map((part, i) => {
                            // Logic: Calculate "Health Remaining" instead of "Usage"
                            const limit = 20;
                            const usedPct = Math.min((part.usage / limit) * 100, 100);
                            const healthPct = 100 - usedPct; // 100% is New, 0% is Dead.

                            // Color Logic: 100-50 (Cyan), 49-20 (Amber), <20 (Red)
                            let barColor = 'bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.6)]';
                            let textColor = 'text-cyan-400';
                            let Icon = Cpu;

                            if (healthPct < 50) { barColor = 'bg-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)]'; textColor = 'text-amber-400'; Icon = Settings; }
                            if (healthPct < 20) { barColor = 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.8)] animate-pulse'; textColor = 'text-rose-500'; Icon = AlertCircle; }

                            return (
                                <div key={i} className="relative flex flex-col sm:flex-row gap-2 sm:gap-4 p-3 lg:p-4 bg-slate-900/40 border-b border-white/5 rounded-lg hover:bg-slate-800/50 transition-all group/item items-center">

                                    {/* Component Info */}
                                    <div className="flex-1 flex items-center gap-3">
                                        <div className={`p-2 rounded-lg bg-slate-950 border border-white/10 ${textColor} shadow-lg shrink-0`}>
                                            <Icon size={18} />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-bold text-white tracking-tight truncate">{part.name}</span>
                                            <span className="text-[10px] text-slate-400 font-mono tracking-wider font-medium">{part.id || `ID-${1000 + i}`}</span>
                                        </div>
                                    </div>

                                    {/* Health Bar */}
                                    <div className="flex-1 w-full sm:w-auto flex flex-col justify-center px-4">
                                        <div className="flex justify-between items-end mb-1">
                                            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Health</span>
                                            <span className={`text-[10px] font-mono font-black ${textColor}`}>
                                                {Math.round(healthPct)}%
                                            </span>
                                        </div>
                                        <div className="h-[8px] w-full bg-slate-950 rounded-full overflow-hidden border border-white/5 relative">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                                                style={{ width: `${healthPct}%` }}
                                            ></div>
                                        </div>
                                        {/* Micro-Data: Last Replaced */}
                                        <div className="flex justify-end mt-1">
                                            <span className="text-[8px] text-slate-600 font-mono uppercase tracking-wide">
                                                Last Replaced: <span className="text-slate-500">2024-01-15</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2. SYSTEM ACTIVITY FEED (50%) */}
            <div className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-xl flex flex-col shadow-2xl relative group overflow-hidden">
                {/* Highlight Accent */}
                <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600"></div>

                <div className="p-4 lg:p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                    <h3 className="text-sm lg:text-base font-black text-white uppercase tracking-[0.15em] flex items-center gap-3 font-sans">
                        <Activity size={20} className="text-blue-400" />
                        System Activity
                    </h3>
                    <button className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors uppercase border border-white/10 px-4 py-1.5 rounded-lg hover:bg-white/5 tracking-wider">
                        History
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 lg:p-3 bg-slate-950/30 relative">
                    <div className="relative pl-4 space-y-4 pb-8">
                        {/* Continuous Vertical Line */}
                        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-800"></div>

                        {maintenanceLogs && maintenanceLogs.slice(0, 3).map((log, index) => {
                            const isMech = index % 2 === 0;
                            // Visual Status Cues (Accent Bar & Dot)
                            const accentColor = isMech ? 'bg-amber-500' : 'bg-blue-500';
                            const dotGlow = isMech ? 'shadow-[0_0_15px_#f59e0b] animate-pulse' : 'shadow-[0_0_15px_#3b82f6] animate-pulse';
                            const borderColor = isMech ? 'border-amber-500/50' : 'border-blue-500/50';
                            const highlightClass = index === 0 ? "bg-slate-800/40 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]" : "bg-slate-900/40"; // Top feed highlight

                            return (
                                <div key={log.id} className="relative pl-10 group/card">
                                    {/* Timeline Dot */}
                                    <div className={`absolute left-3 top-6 w-5 h-5 rounded-full border-[3px] border-slate-900 z-10 ${accentColor} ${dotGlow}`}></div>

                                    {/* Card Content - Subtle container */}
                                    <div className={`
                                relative border-l-4 ${borderColor} ${highlightClass} border-y border-r border-white/5 
                                p-3 lg:p-4 rounded-r-xl rounded-l-sm hover:bg-slate-800/60 hover:scale-[1.01] transition-all duration-300 shadow-lg
                            `}>
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] sm:text-xs font-black px-2 py-1 rounded text-center tracking-widest uppercase ${isMech ? 'text-amber-400 bg-amber-950/30' : 'text-blue-400 bg-blue-950/30'}`}>
                                                {isMech ? 'MECHANICAL' : 'SYSTEM'}
                                            </span>
                                            {/* Clear Timestamp */}
                                            <span className="text-xs sm:text-sm font-mono font-bold text-slate-400 tabular-nums">
                                                {log.date} <span className="text-[10px] text-slate-600 ml-1">14:20</span>
                                            </span>
                                        </div>

                                        {/* Action Label - ALL CAPS BOLD */}
                                        <h4 className="text-sm sm:text-base font-black text-white mb-3 uppercase tracking-wide leading-snug drop-shadow-sm">
                                            {log.action}
                                        </h4>

                                        <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                                            <div className="w-6 h-6 rounded-full bg-slate-950 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-inner">
                                                {log.technician.charAt(0)}
                                            </div>
                                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase flex items-center gap-1 tracking-wider">
                                                Technician: <span className="text-slate-200">{log.technician}</span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {(!maintenanceLogs || maintenanceLogs.length === 0) && (
                            <div className="flex flex-col items-center justify-center h-32 text-slate-500 text-xs italic">
                                No recent activity logs found.
                            </div>
                        )}

                    </div>
                    {/* Watermark in blank space */}
                    <div className="absolute bottom-2 right-4 flex items-center gap-2 opacity-20 pointer-events-none">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-500">System Optimized</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CompactAnalytics;
