import React from 'react';
import { Clock, AlertTriangle, PlayCircle, StopCircle, Zap } from 'lucide-react';

const OpCard = ({ op }) => {
    // Condition Logic
    const isStopped = op.status === 'Stopped';
    const isWarning = op.status === 'Warning' || (op.downtime > 30 && !isStopped);
    const isRunning = op.status === 'Running' && !isWarning && !isStopped;

    // Dynamic Styles
    let borderClass = "border-white/5";
    let bgClass = "bg-slate-900/40";
    let statusColor = "text-slate-500";
    let glowClass = "";
    let indicatorColor = "bg-slate-600";
    let statusIcon = <Zap className="w-4 h-4 text-slate-500" />;

    // Status Text Shadow for neon effect
    let textGlow = "";

    if (isStopped) {
        borderClass = "border-red-500/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.15)]";
        bgClass = "bg-red-950/10";
        statusColor = "text-red-500";
        indicatorColor = "bg-red-500 shadow-[0_0_15px_#ef4444]";
        statusIcon = <StopCircle className="w-4 h-4 text-red-500 animate-pulse" />;
        textGlow = "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    } else if (isWarning) {
        borderClass = "border-amber-500/50";
        bgClass = "bg-amber-950/10";
        statusColor = "text-amber-400";
        glowClass = "shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]";
        indicatorColor = "bg-amber-400 shadow-[0_0_15px_#f59e0b]";
        statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />;
        textGlow = "drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]";
    } else if (isRunning) {
        borderClass = "border-cyan-500/30";
        bgClass = "bg-slate-800/20";
        glowClass = "hover:shadow-[0_0_40px_-5px_rgba(34,211,238,0.3)] hover:border-cyan-400/50 hover:bg-slate-800/40";
        statusColor = "text-cyan-400";
        indicatorColor = "bg-cyan-400 shadow-[0_0_15px_#22d3ee]";
        statusIcon = <PlayCircle className="w-4 h-4 text-cyan-400" />;
        textGlow = "drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]";
    }

    return (
        <div className={`
      relative flex flex-col w-full h-full
      rounded-2xl border ${borderClass} ${bgClass} ${glowClass}
      backdrop-blur-md transition-all duration-500 ease-out transform hover:scale-[1.02]
      overflow-hidden p-5 gap-0 group
    `}>
            {/* Ambient Background Gradient for subtle depth */}
            <div className={`absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}></div>

            {/* Header: ID & Live Indicator */}
            <div className="flex justify-between items-start pb-3 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {/* Ping Only if Running or Warning */}
                        {(isRunning || isWarning) && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${indicatorColor}`}></span>
                        )}
                        <div className={`w-3 h-3 rounded-full ${indicatorColor} relative z-10`} />
                    </div>
                    <span className="text-xl font-bold text-white tracking-widest font-mono opacity-90 group-hover:opacity-100 group-hover:text-white transition-opacity">
                        {op.name}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-black/30 px-2 py-1 rounded border border-white/5">
                    {statusIcon}
                    <span className={`text-[10px] font-mono uppercase tracking-[0.15em] font-bold ${statusColor}`}>
                        {op.status}
                    </span>
                </div>
            </div>

            {/* Scale-able Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1 group-hover:text-cyan-200/70 transition-colors">MTBF Metric</span>

                <div className="flex items-baseline gap-2 translate-y-1">
                    <span className={`text-6xl font-black font-mono text-white tracking-tighter ${textGlow} transition-all duration-300`}>
                        {op.mtbf.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">min</span>
                </div>

                {/* Decorative Line under metric */}
                <div className="w-16 h-[2px] bg-white/10 mt-4 rounded-full overflow-hidden">
                    <div className={`h-full ${isRunning ? 'bg-cyan-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'} w-full -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out`}></div>
                </div>
            </div>

            {/* Compact Footer Metrics */}
            <div className="grid grid-cols-2 mt-auto pt-3 border-t border-white/5 bg-black/10 -mx-5 -mb-5 px-5 pb-5 relative z-10">
                <div className="flex flex-col gap-1 pt-1">
                    <div className="flex items-center gap-2 text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">MTTR</span>
                    </div>
                    <span className="text-xl font-mono font-bold text-slate-300 group-hover:text-white transition-colors">
                        {op.mttr}<span className="text-[10px] text-slate-600 ml-1">m</span>
                    </span>
                </div>

                <div className="flex flex-col gap-1 pt-1 border-l border-white/5 pl-4">
                    <div className="flex items-center gap-2 text-slate-500">
                        <AlertTriangle className={`w-3 h-3 ${op.downtime > 0 ? 'text-amber-500' : ''}`} />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Down</span>
                    </div>
                    <span className={`text-xl font-mono font-bold ${op.downtime > 0 ? 'text-amber-400' : 'text-slate-300'} group-hover:text-white transition-colors`}>
                        {op.downtime}<span className="text-[10px] text-slate-600 ml-1">m</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

const OperationMatrix = ({ operations = [] }) => {
    // Dynamic Grid Layout Calculation
    const count = operations.length;
    let gridClass = "grid-cols-5"; // Default

    if (count <= 3) gridClass = "grid-cols-3";
    else if (count === 4) gridClass = "grid-cols-4";
    else if (count === 5) gridClass = "grid-cols-5";
    else if (count > 5 && count <= 8) gridClass = "grid-cols-4"; // 2 rows of 4
    else if (count > 8) gridClass = "grid-cols-5"; // 2 rows of 5

    return (
        <section className={`h-[50%] w-full p-6 grid ${gridClass} gap-6`}>
            {operations.map((op) => (
                <OpCard key={op.id} op={op} />
            ))}
        </section>
    );
};

export default OperationMatrix;
