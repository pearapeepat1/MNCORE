import React from 'react';
import { Clock, AlertTriangle, PlayCircle, StopCircle, Zap, Activity, Settings } from 'lucide-react';

const Waveform = ({ running }) => (
    <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden h-[60%] top-[20%]">
        <svg viewBox="0 0 200 100" className="w-full h-full preserve-3d">
            <path
                d="M0 50 Q 20 50 30 50 L 35 20 L 45 80 L 50 50 L 80 50 L 85 30 L 95 70 L 100 50 L 200 50"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                className={`text-cyan-400 ${running ? 'animate-dash-scroll' : ''}`}
                strokeDasharray="200"
            />
        </svg>
    </div>
);

const OpCard = ({ op }) => {
    // Condition Logic
    const isStopped = op.status === 'Stopped';
    const isWarning = op.status === 'Warning' || (op.downtime > 30 && !isStopped);
    const isRunning = op.status === 'Running' && !isWarning && !isStopped;

    // Dynamic Styles for Glassmorphism 2.0 (Compact)
    let borderClass = "border-white/10 shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]";
    let bgClass = "bg-slate-900/60";
    let statusColor = "text-slate-500";
    let statusIcon = <Zap className="w-3 h-3 text-slate-500" />;

    // Status Text Shadow for neon effect
    let textGlow = "";

    if (isStopped) {
        borderClass = "border-red-500/50 shadow-[inset_0_0_20px_rgba(220,38,38,0.15)]";
        bgClass = "bg-red-950/20";
        statusColor = "text-red-500";
        statusIcon = <StopCircle className="w-3 h-3 text-red-500 animate-pulse" />;
        textGlow = "drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]";
    } else if (isWarning) {
        borderClass = "border-amber-500/50 shadow-[inset_0_0_15px_rgba(245,158,11,0.1)]";
        bgClass = "bg-amber-950/20";
        statusColor = "text-amber-400";
        statusIcon = <AlertTriangle className="w-3 h-3 text-amber-400 animate-bounce" />;
        textGlow = "drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]";
    } else if (isRunning) {
        borderClass = "border-cyan-500/30 shadow-[inset_0_0_15px_rgba(34,211,238,0.05)]";
        bgClass = "bg-slate-900/60";
        statusColor = "text-cyan-400";
        statusIcon = <PlayCircle className="w-3 h-3 text-cyan-400" />;
        textGlow = "drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]";
    }

    return (
        <div className={`
            relative flex flex-col w-full h-full
            rounded-xl border ${borderClass} ${bgClass}
            backdrop-blur-xl transition-all duration-500 ease-out transform hover:scale-[1.02] hover:-translate-y-1
            overflow-hidden p-4 gap-0 group
        `}>
            {/* Dynamic Gradient Border Effect */}
            <div className={`absolute inset-0 border border-transparent ${isRunning ? 'group-hover:border-cyan-500/30' : ''} rounded-xl transition-colors duration-500 pointer-events-none`}></div>

            {/* Header: ID & Live Indicator */}
            <div className="flex justify-between items-start pb-2 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        {(isRunning || isWarning) && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStopped ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isStopped ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                    </div>
                    <span className="text-sm font-bold text-white tracking-widest font-mono opacity-90 group-hover:opacity-100 transition-opacity">
                        {op.name}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-1.5 bg-black/40 px-2 py-0.5 rounded border border-white/5 shadow-inner">
                    {statusIcon}
                    <span className={`text-[9px] font-mono uppercase tracking-wider font-bold ${statusColor}`}>
                        {op.status}
                    </span>
                </div>
            </div>

            {/* Scale-able Content Area (Compressed) */}
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-1">
                {/* Waveform Background */}
                {isRunning && <Waveform running={true} />}

                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-0 group-hover:text-cyan-200/50 transition-colors relative z-10">MTBF Metric</span>

                <div className="flex items-baseline gap-1.5 translate-y-0 relative z-10">
                    <span className={`text-4xl font-black font-mono text-white tracking-tighter ${textGlow} transition-all duration-300`}>
                        {op.mtbf.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">min</span>
                </div>

                {/* Decorative Line */}
                <div className="w-12 h-[1px] bg-white/10 mt-2 rounded-full overflow-hidden relative z-10">
                    <div className={`h-full ${isRunning ? 'bg-cyan-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'} w-full -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out`}></div>
                </div>
            </div>

            {/* Compact Footer Metrics */}
            <div className="flex justify-between items-center mt-auto pt-2 border-t border-white/5 relative z-10">
                {/* MTTR */}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5 transition-colors`}>
                    <Clock className="w-2.5 h-2.5 text-slate-500" />
                    <div className="flex flex-col leading-none">
                        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">MTTR</span>
                        <span className="text-xs font-mono font-bold text-slate-300">{op.mttr}m</span>
                    </div>
                </div>

                {/* Downtime */}
                <div className={`flex items-center gap-1.5 px-2 py-1 rounded bg-black/20 border border-white/5 ${op.downtime > 0 ? 'border-amber-500/30' : ''} transition-colors`}>
                    <AlertTriangle className={`w-2.5 h-2.5 ${op.downtime > 0 ? 'text-amber-500' : 'text-slate-500'}`} />
                    <div className="flex flex-col leading-none text-right">
                        <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider">DOWN</span>
                        <span className={`text-xs font-mono font-bold ${op.downtime > 0 ? 'text-amber-400' : 'text-slate-300'}`}>{op.downtime}m</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OperationMatrix = ({ operations = [] }) => {
    // Hardcoded 5-column grid for standardization
    const gridClass = "grid-cols-5";

    return (
        <section className="h-[45vh] w-full px-6 py-2 flex flex-col gap-2 relative z-30">
            {/* Standardized Section Header */}
            <div className="flex items-center gap-3 w-full pl-1 mt-2">
                <div className="p-1.5 bg-cyan-950/30 rounded border border-cyan-500/20">
                    <Settings className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-[0.2em] shadow-black drop-shadow-md">
                    Operation Performance Matrix
                </h3>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-cyan-500/20 via-white/5 to-transparent"></div>
                <div className="text-[9px] font-mono text-cyan-500/40 uppercase tracking-widest hidden sm:block">
                    Real-time Metrics // Active
                </div>
            </div>

            {/* Grid Container - 100% Height minus header */}
            <div className={`grid ${gridClass} gap-4 h-full pb-2`}>
                {operations.map((op) => (
                    <OpCard key={op.id} op={op} />
                ))}
            </div>
        </section>
    );
};

export default OperationMatrix;
