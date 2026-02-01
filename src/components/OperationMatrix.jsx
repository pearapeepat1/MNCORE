import React from 'react';
import { Clock, AlertTriangle, Activity } from 'lucide-react';

const OpCard = ({ op }) => {
    // Condition Logic
    const isStopped = op.status === 'Stopped';
    const isWarning = op.status === 'Warning' || (op.downtime > 30 && !isStopped);
    const isRunning = op.status === 'Running' && !isWarning && !isStopped;

    // Dynamic Styles
    let borderClass = "border-white/10";
    let bgClass = "bg-slate-900/40";
    let statusColor = "text-slate-400";
    let glowClass = "";
    let indicatorColor = "bg-slate-500";

    if (isStopped) {
        borderClass = "border-red-500/60 shadow-[inset_0_0_20px_rgba(220,38,38,0.2)]";
        bgClass = "bg-red-950/20";
        statusColor = "text-red-400";
        indicatorColor = "bg-red-500 shadow-[0_0_10px_#ef4444]";
    } else if (isWarning) {
        borderClass = "border-amber-500/60 animate-pulse";
        bgClass = "bg-amber-950/20";
        statusColor = "text-amber-400";
        glowClass = "shadow-[0_0_20px_-5px_rgba(245,158,11,0.2)]";
        indicatorColor = "bg-amber-400 shadow-[0_0_10px_#fbbf24]";
    } else if (isRunning) {
        borderClass = "border-cyan-500/30";
        bgClass = "bg-slate-900/40"; // Keep consistent background
        glowClass = "hover:shadow-[0_0_30px_-5px_rgba(34,211,238,0.2)]";
        statusColor = "text-cyan-400";
        indicatorColor = "bg-cyan-400 shadow-[0_0_10px_#22d3ee]";
    }

    return (
        <div className={`
      relative flex flex-col w-full h-full
      rounded-xl border ${borderClass} ${bgClass} ${glowClass}
      backdrop-blur-md transition-all duration-300
      overflow-hidden p-4 gap-2
    `}>
            {/* Card Header */}
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${indicatorColor}`} />
                    <h3 className="text-lg font-bold text-white tracking-wide">{op.name}</h3>
                </div>
                <span className={`text-[10px] font-mono uppercase tracking-wider ${statusColor} px-1.5 py-0.5 rounded-sm bg-black/20 text-center min-w-[60px]`}>
                    {op.status}
                </span>
            </div>

            {/* Content Container - Flex Grow to push Footer down */}
            <div className="flex-1 flex flex-col justify-center items-center py-1">
                {/* MTBF Hero */}
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">MTBF</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl lg:text-5xl font-black font-mono text-white drop-shadow-lg">
                        {op.mtbf.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">min</span>
                </div>

                {/* Visual Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${isRunning ? 'bg-cyan-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'
                            }`}
                        style={{ width: `${Math.min((op.mtbf / 3000) * 100, 100)}%` }}
                    />
                </div>
            </div>

            {/* Footer Metrics */}
            <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-white/5">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                        <Clock className="w-3 h-3" />
                        <span>MTTR</span>
                    </div>
                    <span className="text-xl font-mono font-bold text-slate-200">
                        {op.mttr}<span className="text-[10px] text-slate-500 ml-0.5">m</span>
                    </span>
                </div>
                <div className="flex flex-col border-l border-white/5 pl-2">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-wider font-bold">
                        <AlertTriangle className={`w-3 h-3 ${op.downtime > 0 ? 'text-amber-500' : ''}`} />
                        <span>DOWN</span>
                    </div>
                    <span className={`text-xl font-mono font-bold ${op.downtime > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                        {op.downtime}<span className="text-[10px] text-slate-500 ml-0.5">m</span>
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
        <section className={`h-[50%] w-full p-6 grid ${gridClass} gap-4`}>
            {operations.map((op) => (
                <OpCard key={op.id} op={op} />
            ))}
        </section>
    );
};

export default OperationMatrix;
