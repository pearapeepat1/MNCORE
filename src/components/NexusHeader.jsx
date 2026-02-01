import React from 'react';

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
                        strokeWidth="6"
                        fill="transparent"
                        className="text-slate-800"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="50%"
                        cy="50%"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="6"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={`${color} transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]`}
                    />
                </svg>
                {/* Value Text */}
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold font-mono text-white tracking-tighter shadow-black drop-shadow-md">
                        {value}%
                    </span>
                </div>
            </div>
            <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-slate-400 group-hover:text-slate-200 transition-colors">
                {label}
            </span>
        </div>
    );
};

const Selector = ({ label, value, options = [], onChange }) => (
    <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
          appearance-none bg-slate-900/80 border border-white/10 
          text-cyan-400 font-mono text-sm font-bold 
          py-1 px-3 pr-8 rounded-md 
          focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20
          cursor-pointer hover:bg-slate-800 transition-colors
          w-32 uppercase
        "
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
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
    // Use data or defaults
    const oee = data?.efficiency || 0;
    const healthScore = data?.health === 'Good' ? 98 : data?.health === 'Warning' ? 75 : 45;
    const isRunning = data?.status === 'Running';
    const isStopped = data?.status === 'Stopped';

    // Status Colors
    let statusColor = "text-amber-400";
    let statusBg = "bg-amber-950/30 border-amber-500/30";
    let statusGlow = "shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]";
    let statusDot = "bg-amber-500";
    let statusText = "IDLE";

    if (isRunning) {
        statusColor = "text-emerald-400";
        statusBg = "bg-emerald-950/30 border-emerald-500/30";
        statusGlow = "shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]";
        statusDot = "bg-emerald-500";
        statusText = "RUNNING";
    } else if (isStopped) {
        statusColor = "text-red-500";
        statusBg = "bg-red-950/30 border-red-500/30";
        statusGlow = "shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]";
        statusDot = "bg-red-500";
        statusText = "STOPPED";
    }

    return (
        <header className="h-[15%] w-full bg-slate-950/50 backdrop-blur-sm border-b border-white/5 flex items-center justify-between px-8 py-2 relative z-50">

            {/* Branding & Selectors Section */}
            <div className="flex items-center gap-12">
                <div className="flex flex-col justify-center">
                    <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                        MNCORE
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <div className="h-[2px] w-6 bg-cyan-500/50"></div>
                        <span className="text-[10px] font-mono text-cyan-200/70 tracking-[0.2em] uppercase">
                            Predictive Suite v3.0
                        </span>
                    </div>
                </div>

                {/* Input Selectors */}
                <div className="flex items-center gap-4 pl-8 border-l border-white/10 h-12">
                    <Selector
                        label="PD Code"
                        value={selectedPD}
                        options={pdList}
                        onChange={onSelectPD}
                    />
                    <Selector
                        label="Line Code"
                        value={selectedLine}
                        options={lineList}
                        onChange={onSelectLine}
                    />
                </div>
            </div>

            {/* Central HUD / Gauges */}
            <div className="flex items-center gap-12">
                <CircularGauge value={oee} label="OEE EFFICIENCY" color="text-cyan-400" />
                <CircularGauge value={healthScore} label="SYSTEM HEALTH" color="text-emerald-400" />
            </div>

            {/* Right Status Pill */}
            <div className="flex items-center">
                <div className={`
                    flex items-center gap-4 px-8 py-3 rounded-full border 
                    ${statusBg} ${statusGlow}
                    backdrop-blur-md transition-all duration-500
                `}>
                    <div className="relative flex h-4 w-4">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusDot}`}></span>
                        <span className={`relative inline-flex rounded-full h-4 w-4 ${statusDot}`}></span>
                    </div>
                    <span className={`text-2xl font-black tracking-widest ${statusColor} drop-shadow-md`}>
                        LINE {statusText}
                    </span>
                </div>
            </div>

        </header>
    );
};

export default NexusHeader;
