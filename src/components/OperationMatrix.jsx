import React from 'react';
import { Clock, AlertTriangle, PlayCircle, StopCircle, Zap, Activity } from 'lucide-react';

const Waveform = ({ running }) => (
    <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
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

    // Dynamic Styles for Glassmorphism 2.0
    let borderClass = "border-white/5 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]";
    let bgClass = "bg-[#020617]/70";
    let statusColor = "text-slate-500";
    let statusIcon = <Zap className="w-4 h-4 text-slate-500" />;

    // Status Text Shadow for neon effect
    let textGlow = "";

    if (isStopped) {
        borderClass = "border-red-500/50 shadow-[inset_0_0_30px_rgba(220,38,38,0.2)]";
        bgClass = "bg-red-950/20";
        statusColor = "text-red-500";
        statusIcon = <StopCircle className="w-4 h-4 text-red-500 animate-pulse" />;
        textGlow = "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]";
    } else if (isWarning) {
        borderClass = "border-amber-500/50 shadow-[inset_0_0_20px_rgba(245,158,11,0.15)]";
        bgClass = "bg-amber-950/20";
        statusColor = "text-amber-400";
        statusIcon = <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />;
        textGlow = "drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]";
    } else if (isRunning) {
        borderClass = "border-cyan-500/30 shadow-[inset_0_0_20px_rgba(34,211,238,0.05)]";
        bgClass = "bg-[#020617]/70";
        statusColor = "text-cyan-400";
        statusIcon = <PlayCircle className="w-4 h-4 text-cyan-400" />;
        textGlow = "drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]";
    }

    return (
        <div className={`
      relative flex flex-col w-full h-full
      rounded-2xl border ${borderClass} ${bgClass}
      backdrop-blur-2xl transition-all duration-500 ease-out transform hover:scale-[1.03] hover:-translate-y-1
      overflow-hidden p-5 gap-0 group
    `}>
            {/* Dynamic Gradient Border Effect via pseudo-element or absolute div */}
            <div className={`absolute inset-0 border-2 border-transparent ${isRunning ? 'group-hover:border-cyan-500/30' : ''} rounded-2xl transition-colors duration-500 pointer-events-none`}></div>

            {/* Header: ID & Live Indicator */}
            <div className="flex justify-between items-start pb-3 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        {/* Ping Only if Running or Warning */}
                        {(isRunning || isWarning) && (
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isStopped ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isStopped ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-cyan-500'}`}></span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-widest font-mono opacity-90 group-hover:opacity-100 group-hover:text-white transition-opacity">
                        {op.name}
                    </span>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2 bg-black/40 px-2.5 py-1 rounded border border-white/10 shadow-inner">
                    {statusIcon}
                    <span className={`text-[10px] font-mono uppercase tracking-[0.15em] font-bold ${statusColor}`}>
                        {op.status}
                    </span>
                </div>
            </div>

            {/* Scale-able Content Area */}
            <div className="flex-1 flex flex-col justify-center items-center relative z-10 py-2">
                {/* Animated Waveform Background */}
                {isRunning && <Waveform running={true} />}

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-1 group-hover:text-cyan-200/70 transition-colors relative z-10">MTBF Metric</span>

                <div className="flex items-baseline gap-2 translate-y-1 relative z-10">
                    <span className={`text-6xl font-black font-mono text-white tracking-tighter ${textGlow} transition-all duration-300`}>
                        {op.mtbf.toLocaleString()}
                    </span>
                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">min</span>
                </div>

                {/* Decorative Line under metric */}
                <div className="w-16 h-[2px] bg-white/10 mt-4 rounded-full overflow-hidden relative z-10">
                    <div className={`h-full ${isRunning ? 'bg-cyan-500' : isWarning ? 'bg-amber-500' : 'bg-red-500'} w-full -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out`}></div>
                </div>
            </div>

            {/* Compact Footer Metrics - Capsules */}
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5 relative z-10">
                {/* MTTR Capsule */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 ${isRunning ? 'group-hover:border-cyan-500/20' : ''} transition-colors`}>
                    <Clock className="w-3 h-3 text-slate-500" />
                    <div className="flex flex-col leading-none">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">MTTR</span>
                        <span className="text-sm font-mono font-bold text-slate-300">{op.mttr}m</span>
                    </div>
                </div>

                {/* Downtime Capsule */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 ${op.downtime > 0 ? 'border-amber-500/30' : ''} transition-colors`}>
                    <AlertTriangle className={`w-3 h-3 ${op.downtime > 0 ? 'text-amber-500' : 'text-slate-500'}`} />
                    <div className="flex flex-col leading-none text-right">
                        <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider">DOWN</span>
                        <span className={`text-sm font-mono font-bold ${op.downtime > 0 ? 'text-amber-400' : 'text-slate-300'}`}>{op.downtime}m</span>
                    </div>
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
