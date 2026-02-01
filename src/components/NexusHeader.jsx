import React, { useState, useEffect } from 'react';

// --- Sub-Components ---

const ScaleMarks = ({ cx, cy, radius }) => {
    // Generate marks for 0, 10, 20... 100
    const ticks = [];
    for (let i = 0; i <= 100; i += 10) {
        // Calculate Angle: 0% = -180deg (Left), 100% = 0deg (Right)
        // Adjust standard circle coords: 180deg = Left (-r, 0)
        // We map 0..100 to Math.PI..2*Math.PI (or similar based on coord system)

        // Let's use standard trigonometric rotation:
        // 0%  -> 180 degrees (Math.PI) -> Left
        // 50% -> 270 degrees (1.5 * Math.PI) -> Top
        // 100%-> 360 degrees (0 or 2*Math.PI) -> Right

        // Actually, SVG coord system: 
        // 0% -> Left of center -> Angle PI
        // 100% -> Right of center -> Angle 0
        const angle = Math.PI + (i / 100) * Math.PI;

        const isMajor = i % 20 === 0; // 0, 20, 40, 60, 80, 100
        const tickLen = isMajor ? 8 : 4;
        const textOffset = 18;

        // Tick Position (Outer Rim)
        const x1 = cx + (radius + 12) * Math.cos(angle);
        const y1 = cy + (radius + 12) * Math.sin(angle);
        const x2 = cx + (radius + 12 + tickLen) * Math.cos(angle);
        const y2 = cy + (radius + 12 + tickLen) * Math.sin(angle);

        // Text Position (Beyond Ticks)
        const tx = cx + (radius + 12 + tickLen + textOffset) * Math.cos(angle);
        const ty = cy + (radius + 12 + tickLen + textOffset) * Math.sin(angle);

        ticks.push(
            <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={isMajor ? "#94a3b8" : "#475569"} strokeWidth={isMajor ? 1.5 : 1} />
                {isMajor && (
                    <text x={tx} y={ty} textAnchor="middle" dominantBaseline="middle" className="text-[8px] fill-slate-500 font-mono font-bold" style={{ fontSize: '8px' }}>
                        {i}
                    </text>
                )}
            </g>
        );
    }
    return <g className="opacity-80">{ticks}</g>;
};

const SemiCircleGauge = ({ value, label }) => {
    // Sanitize label for ID usage
    const safeId = label.replace(/\s+/g, '-').toLowerCase();

    // 1. Color Theme (3-Tier)
    const getTheme = (val) => {
        if (val >= 90) return { color: '#10b981', glow: '#10b981', bg: 'text-emerald-500' };
        if (val >= 70) return { color: '#f59e0b', glow: '#f59e0b', bg: 'text-amber-500' };
        return { color: '#ef4444', glow: '#ef4444', bg: 'text-red-500' };
    };

    const { color, glow, bg } = getTheme(value);

    // 2. Geometry
    const radius = 75;
    const strokeWidth = 14;
    const cx = 130;
    const cy = 110;

    // Clamp value
    const clampedValue = Math.min(100, Math.max(0, value));

    // Arc Calculation
    const arcLength = Math.PI * radius;
    // Segment Logic: Split arc into small dashes
    // We want ~40 segments? Arc len is approx 235px.
    // 4px dash, 2px gap => 6px unit. 235/6 = ~39 segments.
    // To 'fill' it, we mask it or use dashoffset logic differently.
    // Simpler approach: Use a DASHED stroke for the track and the fill.
    const segmentSize = 4;
    const gapSize = 3;

    // Calculate total fill length based on percentage
    // For segmented look to "fill up", we keep the dasharray constant but use a mask 
    // OR we just use a solid dashed line that is revealed by dashoffset.
    // Standard dashoffset works for dashes too if the pattern is consistent!

    const strokeDashoffset = arcLength * (1 - clampedValue / 100);

    return (
        <div className="relative flex flex-col items-center justify-end w-[260px] h-[150px]">

            {/* Main Content: Scaled Down Number */}
            <div className="absolute bottom-[25px] left-0 right-0 flex flex-col items-center z-10 w-full">
                <span className="text-[3rem] font-bold font-mono text-white tracking-tight drop-shadow-xl leading-none">
                    {Math.round(clampedValue)}%
                </span>
                <span className={`text-[9px] uppercase font-bold tracking-[0.2em] ${bg} mt-1`} style={{ textShadow: `0 0 10px ${color}` }}>
                    {label}
                </span>
            </div>

            {/* SVG Layer */}
            <div className="relative w-[260px] h-[140px] overflow-visible">
                <svg viewBox="0 0 260 140" className="w-full h-full overflow-visible">
                    <defs>
                        <filter id={`glow-${safeId}`} x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id={`grad-${safeId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
                            <stop offset="100%" stopColor={color} stopOpacity="1" />
                        </linearGradient>
                    </defs>

                    {/* Scale Marks */}
                    <ScaleMarks cx={cx} cy={cy} radius={radius} />

                    {/* Background Track (Segmented) */}
                    <path
                        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                        fill="none"
                        stroke="#1e293b"
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${segmentSize} ${gapSize}`}
                        className="opacity-30"
                    />

                    {/* Active Fill Arc (Segmented) */}
                    {/* We overlay a segmented stroke that is REVEALED by a mask or calculated carefully. 
                        Actually, simply applying dasharray AND dashoffset works if the "total length" logic holds.
                        But dashoffset shifts the pattern. 
                        Better Trick: Use a pathLength="100" and dasharray="100 100" (Masking) approach or 
                        Use a MASK. Let's use a Mask for perfect revealing of segments without scrolling them.
                    */}
                    <mask id={`mask-${safeId}`}>
                        <path
                            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                            fill="none"
                            stroke="white"
                            strokeWidth={strokeWidth + 2} // Slightly wider to cover
                            strokeDasharray={arcLength}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="butt"
                            className="transition-[stroke-dashoffset] duration-700 ease-out"
                        />
                    </mask>

                    <path
                        d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
                        fill="none"
                        stroke={`url(#grad-${safeId})`}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={`${segmentSize} ${gapSize}`}
                        mask={`url(#mask-${safeId})`}
                        style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
                    />

                </svg>
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
        <div className="flex flex-col items-end text-right border-l border-white/10 pl-6 py-1">
            <span className="text-[10px] font-mono text-cyan-500/50 uppercase tracking-widest mb-1">
                ASIA/BANGKOK • GMT+7
            </span>
            <div className="text-4xl font-mono font-bold text-white leading-none tracking-widest flex items-center">
                {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                <span className="text-xl text-slate-500 mx-2 animate-pulse">:</span>
                <span className="text-2xl text-slate-400">
                    {time.getSeconds().toString().padStart(2, '0')}
                </span>
            </div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-2">
                {time.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
            </div>
        </div>
    );
};

const Selector = ({ label, value, options = [], onChange }) => (
    <div className="w-full group">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1 block mb-1.5 group-hover:text-cyan-400 transition-colors">
            {label}
        </label>
        <div className="relative">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none bg-[#0f172a] border border-cyan-900/40 text-cyan-100 font-mono text-sm font-bold py-2.5 px-4 rounded-lg focus:outline-none focus:border-cyan-500 hover:bg-slate-900 transition-all cursor-pointer uppercase shadow-lg"
            >
                {options.map(opt => (
                    <option key={opt} value={opt} className="bg-slate-950">{opt}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-cyan-500/60">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
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
    // Data Binding
    const oee = data?.efficiency || 0;
    const healthScore = data?.health === 'Good' ? 98 : data?.health === 'Warning' ? 75 : 45;
    const isRunning = data?.status === 'Running';
    const isStopped = data?.status === 'Stopped';

    // Status Badge Logic
    let statusConfig = {
        text: "IDLE",
        style: "border-amber-500/30 bg-amber-950/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.1)]",
        dot: "bg-amber-500"
    };

    if (isRunning) {
        statusConfig = {
            text: "RUNNING",
            style: "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
            dot: "bg-emerald-400 shadow-[0_0_8px_#34d399]"
        };
    } else if (isStopped) {
        statusConfig = {
            text: "STOPPED",
            style: "border-red-500/30 bg-red-950/20 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]",
            dot: "bg-red-500 shadow-[0_0_8px_#ef4444]"
        };
    }

    return (
        <header className="h-[20vh] w-full bg-[#020617] backdrop-blur-2xl border-b border-white/5 shadow-2xl overflow-hidden relative z-50">

            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')] opacity-30 pointer-events-none"></div>

            {/* Zero-Overlap Grid System: 25% | 50% | 25% */}
            <div className="grid grid-cols-[25%_50%_25%] h-full w-full items-center px-8">

                {/* COLUMN 1: Identity & Control (Fixed No-Entry Zone) */}
                <div className="flex flex-col justify-center h-full pr-[40px] border-r border-white/5 relative">
                    {/* Decorative Shine */}
                    <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>

                    <div className="mb-4">
                        <h1 className="text-4xl font-black text-white tracking-[-0.05em] leading-none drop-shadow-lg">
                            MNCORE<span className="text-cyan-400">.</span>
                        </h1>
                        <p className="text-[9px] font-mono text-cyan-200/50 tracking-[0.35em] uppercase mt-1">Predictive Twin v2.1.0</p>
                    </div>

                    <div className="flex gap-4">
                        <Selector label="PD Code" value={selectedPD} options={pdList} onChange={onSelectPD} />
                        <Selector label="Line Code" value={selectedLine} options={lineList} onChange={onSelectLine} />
                    </div>
                </div>

                {/* COLUMN 2: Luminous Gauges (Fill-Based Speedometer) */}
                <div className="flex items-center justify-evenly h-full w-full relative">
                    {/* Horizontal Glow Line at Base */}
                    <div className="absolute bottom-4 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

                    <SemiCircleGauge value={oee} label="OEE Efficiency" />
                    <SemiCircleGauge value={healthScore} label="System Health" />
                </div>

                {/* COLUMN 3: Status & Time (Right Aligned) */}
                <div className="flex flex-col items-end justify-center h-full pl-8 gap-6">
                    {/* Status Badge */}
                    <div className={`px-6 py-3 rounded-lg border flex items-center gap-3 transition-all duration-500 transform hover:scale-105 ${statusConfig.style}`}>
                        <div className="relative w-3 h-3">
                            <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${statusConfig.dot.split(' ')[0]}`}></span>
                            <span className={`relative inline-flex rounded-full h-3 w-3 ${statusConfig.dot}`}></span>
                        </div>
                        <span className="text-xl font-black tracking-[0.15em] font-mono leading-none pt-0.5">
                            {statusConfig.text}
                        </span>
                    </div>

                    <DigitalClock />
                </div>

            </div>
        </header>
    );
};

export default NexusHeader;
