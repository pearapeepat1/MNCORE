import React from 'react';
import { Clock, Wrench, AlertTriangle, Play, Pause, Square, Activity } from 'lucide-react';
import useDashboardScale from '../hooks/useDashboardScale';

const CompactGrid = ({ operations }) => {
    if (!operations || operations.length === 0) return null;

    return (
        <div className="h-full w-full flex flex-col">
            {/* Module Header */}
            <h2 className="text-[1.1vh] font-black text-cyan-500/50 uppercase tracking-[0.3em] flex items-center gap-4 mb-2 shrink-0">
                <span className="h-px flex-1 bg-gradient-to-r from-cyan-500/20 to-transparent"></span>
                Operation Modules :: Active Grid
                <span className="h-px flex-1 bg-gradient-to-l from-cyan-500/20 to-transparent"></span>
            </h2>

            <div
                className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 min-h-0 pb-2 overflow-y-auto pr-2 custom-scrollbar"
            >
                {operations.map((op) => {
                    const isRun = op.status === 'Running';
                    const isWarn = op.status === 'Warning';

                    // Colors
                    const accent = isRun ? 'text-emerald-400' : isWarn ? 'text-amber-400' : 'text-rose-500';
                    const border = isRun ? 'border-emerald-500/20' : isWarn ? 'border-amber-500/20' : 'border-rose-500/20';
                    const glow = isRun ? 'shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'shadow-none';
                    const Icon = isRun ? Play : isWarn ? Pause : Square;

                    return (
                        <div
                            key={op.id}
                            className={`
                                relative flex flex-col justify-between
                                bg-slate-900/60 backdrop-blur-2xl border ${border}
                                rounded-xl p-[2vh] transition-all duration-300
                                ${glow} hover:bg-slate-800/80 hover:border-cyan-500/30
                                group cursor-default h-full min-w-[20vh]
                            `}
                        >
                            {/* 1. Header: ID + Status LED */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex flex-col">
                                    <span className="text-[1.2vh] font-black text-slate-400 uppercase tracking-[0.2em]">{op.id}</span>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isRun ? 'bg-emerald-400 animate-pulse' : isWarn ? 'bg-amber-400' : 'bg-rose-500'}`}></div>
                                        <span className={`text-[1vh] font-bold uppercase tracking-wider ${accent}`}>{op.status}</span>
                                    </div>
                                </div>
                                <Icon size={16} className={`text-slate-600 group-hover:text-white transition-colors`} />
                            </div>

                            {/* 2. Hero Metric: MTBF */}
                            <div className="flex-1 flex flex-col justify-center py-2">
                                <span className="text-[1vh] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 mb-1">
                                    <Activity size={10} /> MTBF Perf.
                                </span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[4vh] leading-none font-mono font-bold text-white tracking-tighter drop-shadow-lg group-hover:text-cyan-400 transition-colors">
                                        {op.mtbf}
                                    </span>
                                    <span className="text-[1vh] font-bold text-slate-600">HRS</span>
                                </div>
                            </div>

                            {/* 3. Footer Metrics */}
                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-2 mt-auto">
                                <div>
                                    <div className="text-[1vh] font-bold text-slate-500 uppercase flex items-center gap-1 mb-0.5"><Wrench size={8} /> MTTR</div>
                                    <div className="text-[1.5vh] font-mono font-bold text-slate-300">{op.mttr}<span className="text-[1vh] ml-0.5 text-slate-600">m</span></div>
                                </div>
                                <div>
                                    <div className="text-[1vh] font-bold text-slate-500 uppercase flex items-center gap-1 mb-0.5"><Clock size={8} /> Down</div>
                                    <div className={`text-[1.5vh] font-mono font-bold ${op.downtime > 0 ? 'text-rose-400' : 'text-slate-300'}`}>
                                        {op.downtime}<span className="text-[1vh] ml-0.5 text-slate-600">m</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CompactGrid;
