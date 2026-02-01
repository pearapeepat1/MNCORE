import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';

const SemiCircleGauge = ({ value, label, color = "text-cyan-400" }) => {
    // Gauge Configuration - Precision Tuned for 100vh Layout
    const radius = 64; // Slightly larger for clarity
    const strokeWidth = 10; // Thinner for 'High-Precision' feel
    const cx = 80;
    const cy = 80;

    // Path Calculation: Top Half Arc
    // Move to (cx - r, cy), Arc to (cx + r, cy)
    const trackPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

    // Correct Arc Geometry for Top Half logic:
    // If we use A radius radius 0 0 1, we get the bottom arc (smile).
    // We want the TOP arc (rainbow).
    // So we need sweep-flag 1 from Left to Right? 
    // Wait. Left point (cx-r, cy). Right point (cx+r, cy).
    // If I go clockwise (sweep 1) from Left to Right, I go UP (negative Y)?
    // Standard SVG coords: Y increases downwards.
    // So (cx-r, cy) is Left. (cx, cy-r) is Top. (cx+r, cy) is Right.
    // Going from Left to Right via Top is "Clockwise" relative to the center?
    // Let's visualize. 9 o'clock -> 12 o'clock -> 3 o'clock.
    // Yes, that is Clockwise.
    // So `0 0 1` (sweep 1) should be correct for Top Arc?
    // Let's re-verify Step 162 logic which used `0 0 0`.
    // Step 162 used `0 0 0`. And it worked (supposedly).
    // Let's stick to the logic: `A radius radius 0 0 1` draws arc in positive angle direction?
    // Actually, let's keep it safe. 180 degree arc. 
    // Start `M 16 80`. End `144 80`.
    // `0 0 1` draws the arc passing through `80 144` (bottom).
    // `0 0 0` draws the arc passing through `80 16` (top).
    // So use `0 0 0`.

    const realTrackPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
    // WAIT. If 0 0 0 is Top, and I want Top, I should use 0.
    // Let's inspect previous output carefully. 
    // Step 162: `trackPath = ... 0 0 0 ...`. Correct.
    // But in Step 182 I might have messed up? No, 182 used `0 0 0`.
    // Okay, I will use `0 0 1` if I swap start/end? 
    // Let's just use `0 0 1` + Start Right End Left? No.
    // Sticking to `0 0 1` and ensuring I get the correct look?
    // Let's perform a safer standard: Start Left, End Right, Sweep 1 gives Down. Sweep 0 gives Up.
    // I want UP.

    const finalPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;
    // Wait, testing `0 0 1` usually gives the "positive" arc. 
    // Let's trust the previous iteration: `0 0 0` worked for Top Half.
    // BUT the standard gauge usually fills clockwise from left (0%) to right (100%).

    // Let's try explicit logic:
    // 0% = 180 deg. 100% = 360 deg.
    // Tip position math:
    // angle = PI + (value/100)*PI.

    const angle = Math.PI + (value / 100) * Math.PI;
    const tipX = cx + radius * Math.cos(angle);
    const tipY = cy + radius * Math.sin(angle);

    const strokeColor = color === 'text-cyan-400' ? '#22d3ee' : '#10b981';

    return (
        <div className="flex flex-col items-center justify-end relative h-[100px] w-[180px]">
            {/* SVG Canvas */}
            <div className="relative w-[160px] h-[80px]">
                <svg className="w-full h-[100px] overflow-visible">
                    <defs>
                        <linearGradient id={`${label}-gradient-precision`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color === 'text-cyan-400' ? '#0891b2' : '#059669'} stopOpacity="1" />
                            <stop offset="100%" stopColor={strokeColor} stopOpacity="1" />
                        </linearGradient>
                        <filter id={`${label}-glow-precision`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* 1. Track (Background) - Muted Slate */}
                    <path
                        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                        fill="none"
                        stroke="#1e293b" /* Slate-800 */
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        className="opacity-50"
                    />

                    {/* 2. Progress Arc - Standard Clockwise from Left */}
                    {/* Note: SVG Paths for arcs are tricky to animate perfectly from 0. 
                        Best way: Use dasharray. 
                        Length of semi-circle = PI * radius.
                    */}
                    <path
                        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                        fill="none"
                        stroke={`url(#${label}-gradient-precision)`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={Math.PI * radius}
                        strokeDashoffset={Math.PI * radius * (1 - value / 100)}
                        className="transition-[stroke-dashoffset] ease-out"
                        style={{ transitionDuration: '800ms' }} // Smooth 0.8s
                        filter={`url(#${label}-glow-precision)`}
                    />

                    {/* 3. High-Precision Needle / Marker */}
                    <g className="transition-all ease-out" style={{ transitionDuration: '800ms', transform: `translateX(${tipX}px) translateY(${tipY}px)` }}>
                        {/* Outer Ring */}
                        <circle cx="0" cy="0" r="6" stroke={strokeColor} strokeWidth="2" fill="#020617" />
                        {/* Inner Dot */}
                        <circle cx="0" cy="0" r="2.5" fill="white" className="drop-shadow-[0_0_4px_white]" />
                    </g>
                </svg>
            </div>

            {/* Value & Label placed BELOW the gauge */}
            <div className="flex flex-col items-center mt-[-10px] z-10 relative">
                <span className="text-5xl font-black font-mono text-white tracking-tight drop-shadow-2xl">
                    {value}%
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${color === 'text-cyan-400' ? 'text-cyan-400' : 'text-emerald-400'} mt-1`}>
                    {label}
                </span>
            </div>

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
            <div className="absolute top-0 right-0 -mt-2 text-[9px] font-mono text-cyan-500/50 uppercase tracking-widest">
                ASIA/BANGKOK • GMT+7
            </div>
            <div className="mt-2 text-3xl font-mono font-bold text-white leading-none tracking-widest flex items-center">
                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                <span className="text-lg text-slate-500 mx-1 animate-pulse">:</span>
                <span className="text-lg text-slate-400">
                    {time.getSeconds().toString().padStart(2, '0')}
                </span>
            </div>
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1 flex gap-2">
                <span>{time.getFullYear()}</span>
                <span className="text-slate-700">|</span>
                <span>{time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }).toUpperCase()}</span>
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
          appearance-none bg-[#020617]/90 border border-cyan-900/30 
          text-cyan-300 font-mono text-xs font-bold 
          py-2 px-3 pr-8 rounded-none first:rounded-l-sm last:rounded-r-sm
          focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 focus:bg-[#0f172a]
          cursor-pointer hover:bg-slate-900 hover:border-cyan-500/30 transition-all duration-300
          w-32 uppercase backdrop-blur-md shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]
        "
            >
                {options.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-950 text-slate-200">{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-cyan-600 group-hover:text-cyan-400 transition-colors">
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
        <header className="h-[15%] w-full bg-[#020617] backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-8 relative z-50 shadow-2xl overflow-hidden">
            {/* Top Border Glow Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50"></div>

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-50"></div>

            {/* LEFT: Branding & Control Group */}
            <div className="flex items-center gap-12 h-full flex-1 relative z-10">
                {/* Logo */}
                <div className="flex flex-col justify-center select-none group min-w-max">
                    <h1 className="text-4xl font-black tracking-[-0.05em] text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:scale-105 origin-left relative">
                        MNCORE
                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left shadow-[0_0_10px_#22d3ee]"></span>
                    </h1>
                    <div className="flex items-center gap-3 mt-1 pl-1">
                        <span className="text-[9px] font-mono text-cyan-200/60 tracking-[0.3em] uppercase font-bold">
                            Predictive Twin v2.1.0
                        </span>
                    </div>
                </div>

                {/* Control Group */}
                <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-white/5 backdrop-blur-md shadow-lg">
                    <Selector label="PD CODE" value={selectedPD} options={pdList} onChange={onSelectPD} />
                    <div className="w-[1px] h-8 bg-white/10"></div>
                    <Selector label="LINE CODE" value={selectedLine} options={lineList} onChange={onSelectLine} />
                </div>
            </div>

            {/* CENTER: Semi-Circle Gauges */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-end justify-center gap-16 h-full pb-2">
                {/* Glass Panel Backing for Gauges */}
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md -z-10 rounded-b-3xl border-x border-b border-white/5 shadow-2xl skew-x-12 transform scale-x-75 origin-top"></div>

                <SemiCircleGauge value={oee} label="OEE Efficiency" color="text-cyan-400" />
                <SemiCircleGauge value={healthScore} label="System Health" color="text-emerald-400" />
            </div>

            {/* RIGHT: Clock & Status */}
            <div className="flex items-center justify-end h-full flex-1 gap-8 relative z-10">
                <DigitalClock />

                {/* Hero Status Badge */}
                <div className={`
                    relative flex items-center justify-center gap-4 w-[240px] py-4 rounded-xl border-2
                    ${statusBg} ${statusBorder} ${statusGlow}
                    backdrop-blur-xl transition-all duration-500 cursor-default
                    group overflow-hidden
                `}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                    <div className="relative flex h-3 w-3">
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusDot}`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${statusDot} ${dotGlow}`}></span>
                    </div>
                    <span className={`text-xl font-black tracking-[0.15em] ${statusColor} drop-shadow-md font-mono mt-[2px]`}>
                        {statusText}
                    </span>
                </div>
            </div>

        </header>
    );
};

export default NexusHeader;
