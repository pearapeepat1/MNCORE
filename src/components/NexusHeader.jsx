import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const CircularGauge = ({ value, label, color = "text-cyan-400" }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center relative group">
            <div className="relative w-24 h-24 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-slate-900/50"
                    />
                    {/* Inner Glow Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeOpacity="0.1"
                        fill="transparent"
                        className={color}
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${color} transition-all duration-1000 ease-out`}
                        filter="url(#glow)"
                        style={{ filter: `drop-shadow(0 0 5px ${color === 'text-cyan-400' ? '#22d3ee' : '#10b981'})` }}
                    />
                    <defs>
                        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
                {/* Value Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-3xl font-black font-mono text-white tracking-tighter drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                        {value}%
                    </span>
                </div>
            </div>
            <span className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 group-hover:text-cyan-400 transition-colors duration-300">
                {label}
            </span>
        </div>
    );
};

const DigitalClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-end mr-6 text-right relative pl-6 border-l border-white/10">
            {/* System Heartbeat Indicator */}
            <div className="absolute left-[-5px] top-1/2 -translate-y-1/2">
                <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            </div>

            <div className="text-3xl font-mono font-bold text-white leading-none tracking-widest flex items-center">
                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                <span className="text-lg text-slate-500 mx-1 animate-pulse">:</span>
                <span className="text-lg text-slate-400">
                    {time.getSeconds().toString().padStart(2, '0')}
                </span>
            </div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">
                {time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </div>
        </div>
    );
};

const Selector = ({ label, value, options = [], onChange }) => (
    <div className="flex flex-col gap-1 group">
        <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
          appearance-none bg-[#0f172a]/80 border border-white/10 
          text-cyan-300 font-mono text-xs font-bold 
          py-2 px-3 pr-8 rounded-none first:rounded-l-lg last:rounded-r-lg
          focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 focus:bg-slate-800
          cursor-pointer hover:bg-slate-800 hover:border-white/20 transition-all duration-300
          w-32 uppercase backdrop-blur-sm
        "
            >
                {options.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-900 text-slate-200">{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 group-hover:text-cyan-400 transition-colors">
                <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
        </div>
    </div>
);

const NexusHeader = ({
    data,
    pdList = [],
    lineList = [],
    selectedPD,
    selectedLine,
    onSelectPD,
    onSelectLine
}) => {
    const oee = data?.efficiency || 0;
    const healthScore = data?.health === 'Good' ? 98 : data?.health === 'Warning' ? 75 : 45;
    const isRunning = data?.status === 'Running';
    const isStopped = data?.status === 'Stopped';

    // Status Styling
    let statusColor = "text-amber-400";
    let statusBg = "bg-amber-950/40";
    let statusBorder = "border-amber-500/30";
    let statusGlow = "shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]";
    let statusDot = "bg-amber-500";
    let statusText = "IDLE";
    let dotGlow = "shadow-[0_0_15px_#f59e0b]";

    if (isRunning) {
        statusColor = "text-emerald-400";
        statusBg = "bg-emerald-950/40";
        statusBorder = "border-emerald-500/30";
        statusGlow = "shadow-[0_0_40px_-5px_rgba(16,185,129,0.3)]";
        statusDot = "bg-emerald-400";
        dotGlow = "shadow-[0_0_20px_#34d399]";
        statusText = "RUNNING";
    } else if (isStopped) {
        statusColor = "text-red-500";
        statusBg = "bg-red-950/40";
        statusBorder = "border-red-500/30";
        statusGlow = "shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]";
        statusDot = "bg-red-500";
        dotGlow = "shadow-[0_0_15px_#ef4444]";
        statusText = "STOPPED";
    }

    return (
        <header className="h-[15%] w-full bg-[#020617]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 relative z-50 shadow-2xl">
            {/* Top Border Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

            {/* LEFT: Branding & Control Group */}
            <div className="flex items-center gap-12 h-full flex-1">
                {/* Logo */}
                <div className="flex flex-col justify-center select-none group min-w-max">
                    <h1 className="text-4xl font-black tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-500 drop-shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-500 group-hover:scale-105 origin-left">
                        MNCORE
                    </h1>
                    <div className="flex items-center gap-3 mt-1 pl-1">
                        <div className="h-[2px] w-6 bg-cyan-400 box-shadow-[0_0_8px_#22d3ee]"></div>
                        <span className="text-[9px] font-mono text-cyan-200/60 tracking-[0.3em] uppercase font-bold">
                            Predictive Suite v3.0
                        </span>
                    </div>
                </div>

                {/* Control Group */}
                <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-xl border border-white/5 backdrop-blur-sm">
                    <Selector label="PD CODE" value={selectedPD} options={pdList} onChange={onSelectPD} />
                    <div className="w-[1px] h-8 bg-white/10"></div>
                    <Selector label="LINE CODE" value={selectedLine} options={lineList} onChange={onSelectLine} />
                </div>
            </div>

            {/* CENTER: Fixed Width Gauges (Non-Collapsing) */}
            <div className="flex items-center justify-center gap-16 w-[360px] flex-shrink-0">
                <CircularGauge value={oee} label="OEE EFFICIENCY" color="text-cyan-400" />
                <CircularGauge value={healthScore} label="SYSTEM HEALTH" color="text-emerald-400" />
            </div>

            {/* RIGHT: Clock & Status */}
            <div className="flex items-center justify-end h-full flex-1 gap-8">
                <DigitalClock />

                {/* Hero Status Badge */}
                <div className={`
                    relative flex items-center justify-center gap-4 w-[240px] py-3 rounded-xl border 
                    ${statusBg} ${statusBorder} ${statusGlow}
                    backdrop-blur-xl transition-all duration-500 cursor-default
                `}>
                    <div className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusDot}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${statusDot} ${dotGlow}`}></span>
                    </div>
                    <span className={`text-xl font-black tracking-[0.15em] ${statusColor} drop-shadow-md font-mono mt-[2px]`}>
                        {statusText}
                    </span>

                    {/* Corner Accents */}
                    <div className="absolute -top-[1px] -left-[1px] w-2 h-2 border-t border-l border-white/30 rounded-tl"></div>
                    <div className="absolute -bottom-[1px] -right-[1px] w-2 h-2 border-b border-r border-white/30 rounded-br"></div>
                </div>
            </div>

        </header>
    );
};

export default NexusHeader;
