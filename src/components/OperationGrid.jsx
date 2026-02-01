import React from 'react';
import { Clock, Wrench, AlertCircle, CheckCircle2, CloudFog, AlertTriangle, PauseCircle } from 'lucide-react';

const OperationGrid = ({ operations }) => {
    if (!operations || operations.length === 0) return null;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-end justify-between border-b border-slate-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"></span>
                    Operations
                </h2>
                <span className="text-slate-500 text-xs font-mono uppercase tracking-widest">
                    {operations.length} Stations Active
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
                {operations.map((op) => (
                    <div
                        key={op.id}
                        className={`
                relative overflow-hidden
                bg-slate-900/60 backdrop-blur-sm border 
                ${op.status === 'Running' ? 'border-slate-800 hover:border-emerald-500/30' :
                                op.status === 'Warning' ? 'border-amber-900/40 hover:border-amber-500/30' :
                                    'border-rose-900/40 hover:border-rose-500/30'}
                rounded-xl p-5 
                transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-xl
                group
            `}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity
                ${op.status === 'Running' ? 'bg-emerald-500' : op.status === 'Warning' ? 'bg-amber-500' : 'bg-rose-500'}
             `}></div>

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-bold text-slate-500 tracking-wider">#{op.id.split('-')[1]}</span>
                                    <h3 className="text-lg font-black text-slate-100">{op.name}</h3>
                                </div>
                                <span className="text-xs text-slate-400 block">{op.type}</span>
                            </div>

                            {/* Status Badge */}
                            <div className={`px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm
                    ${op.status === 'Running'
                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                    : op.status === 'Warning'
                                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${op.status === 'Running' ? 'bg-emerald-400 animate-pulse' : op.status === 'Warning' ? 'bg-amber-400' : 'bg-rose-400'}`}></span>
                                {op.status}
                            </div>
                        </div>

                        <div className="space-y-3 relative z-10">
                            {/* MTBF */}
                            <div className="bg-slate-950/40 rounded-lg p-2.5 border border-slate-800/40 group-hover:border-slate-700/60 transition-colors flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                                        <Clock size={10} /> MTBF
                                    </div>
                                    <span className="text-sm font-bold text-slate-200">{op.mtbf} <span className="text-slate-600 text-[10px]">hrs</span></span>
                                </div>
                                {/* Mini bar chart decoration */}
                                <div className="flex gap-0.5 items-end h-4 w-6">
                                    <div className="w-1 bg-slate-700 h-[40%] rounded-t-sm"></div>
                                    <div className="w-1 bg-slate-600 h-[70%] rounded-t-sm"></div>
                                    <div className="w-1 bg-blue-500 h-[100%] rounded-t-sm shadow-[0_0_5px_#3b82f6]"></div>
                                </div>
                            </div>

                            {/* MTTR */}
                            <div className="bg-slate-950/40 rounded-lg p-2.5 border border-slate-800/40 group-hover:border-slate-700/60 transition-colors flex justify-between items-center">
                                <div>
                                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider mb-0.5">
                                        <Wrench size={10} /> MTTR
                                    </div>
                                    <span className="text-sm font-bold text-slate-200">{op.mttr} <span className="text-slate-600 text-[10px]">mins</span></span>
                                </div>
                            </div>

                            {/* Downtime (Dynamic Alert) */}
                            {op.downtime > 0 && (
                                <div className="bg-rose-500/10 rounded-lg p-2.5 border border-rose-500/20 flex items-center gap-3">
                                    <AlertTriangle className="text-rose-500 w-4 h-4" />
                                    <div>
                                        <div className="text-[10px] text-rose-400 uppercase font-bold">Downtime</div>
                                        <div className="text-sm font-bold text-rose-200">{op.downtime} <span className="text-[10px]">mins</span></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OperationGrid;
