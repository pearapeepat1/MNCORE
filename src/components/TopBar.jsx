import React, { useState } from 'react';
import { Factory, MapPin, Search, Menu, Settings, X, ChevronDown } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const TopBar = ({
    selectedLine,
    onLineChange,
    selectedPD,
    setSelectedPD,
    pdList,
    lineList,
    lineData
}) => {
    const { status, health, efficiency } = lineData || { status: 'Offline', health: 'Critical', efficiency: 0 };
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Status Colors
    const getStatusColor = (s) => {
        switch (s?.toUpperCase()) {
            case 'RUNNING': return 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,1)]';
            case 'IDLE': return 'text-amber-400 drop-shadow-[0_0_20px_rgba(251,191,36,1)]';
            case 'STOPPED': return 'text-rose-500 drop-shadow-[0_0_20px_rgba(244,63,94,1)]';
            default: return 'text-slate-500';
        }
    };

    // Large Hero Gauge
    const HeroGauge = ({ value, label, color }) => {
        const data = [{ value: value }, { value: 100 - value }];

        return (
            <div className="relative w-full h-full flex flex-col items-center justify-center">
                {/* Glow Filter */}
                <div className="absolute inset-0 rounded-full blur-[20px] opacity-20" style={{ backgroundColor: color }}></div>

                <div className="w-full h-[80%] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius="70%"
                                outerRadius="100%"
                                startAngle={90}
                                endAngle={-270}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={4}
                                paddingAngle={2}
                            >
                                <Cell fill={color} />
                                <Cell fill="#0f172a" stroke="#1e293b" strokeWidth={1} />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[3.5vh] font-black text-white font-mono tracking-tighter drop-shadow-md">{value}<span className="text-[1.5vh] text-slate-400 ml-0.5">%</span></span>
                    </div>
                </div>
                <span className="text-[1.2vh] font-black text-slate-400 uppercase tracking-widest mt-1 bg-slate-900/50 px-2 rounded">{label}</span>
            </div>
        );
    };

    const healthColor = health === 'Good' ? '#10b981' : health === 'Warning' ? '#f59e0b' : '#f43f5e';
    const effColor = efficiency > 80 ? '#22d3ee' : efficiency > 50 ? '#f59e0b' : '#f43f5e';

    return (
        <header className="w-full h-full bg-slate-900/60 backdrop-blur-3xl border border-white/10 rounded-2xl relative z-50 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] flex items-center justify-between px-4 lg:px-8 py-2 overflow-hidden">

            {/* 1. BRANDING & CONTROLS */}
            <div className="flex items-center gap-6 lg:w-[25%] h-full">
                <button
                    className="lg:hidden p-2 text-slate-300 hover:text-white"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center justify-center p-3 bg-slate-950 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                        <Factory className="text-cyan-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-widest font-display uppercase leading-none drop-shadow-xl saturate-150">
                            MNCORE
                        </h1>
                        <p className="hidden sm:block text-[1.1vh] text-slate-400 font-mono tracking-[0.3em] mt-1 font-bold opacity-80">PREDICTIVE SUITE v3.0</p>
                    </div>
                </div>

                {/* Desktop Controls (Compact) */}
                <div className="hidden xl:flex items-center gap-2 ml-4">
                    <div className="flex flex-col gap-1">
                        <select
                            value={selectedPD}
                            onChange={(e) => setSelectedPD(e.target.value)}
                            className="bg-slate-950 border border-white/10 rounded px-2 py-0.5 text-[1.1vh] font-bold text-slate-300 outline-none uppercase hover:border-cyan-500/50"
                        >
                            {pdList.map(pd => <option key={pd} value={pd}>{pd}</option>)}
                        </select>
                        <select
                            value={selectedLine}
                            onChange={(e) => onLineChange(e.target.value)}
                            className="bg-slate-950 border border-white/10 rounded px-2 py-0.5 text-[1.1vh] font-bold text-cyan-400 outline-none uppercase hover:border-cyan-500/50"
                        >
                            {lineList.map(line => <option key={line} value={line}>{line}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* 2. CENTER HERO METRICS (Fixed Height Constraints) */}
            <div className="flex-1 hidden lg:flex justify-center items-center h-full gap-16 relative">
                {lineData && (
                    <>
                        {/* Gauge 1: Efficiency */}
                        <div className="relative h-[90%] aspect-square flex flex-col items-center justify-center">
                            <HeroGauge value={efficiency} label="OEE Efficiency" color={effColor} />
                        </div>

                        {/* Vertical Divider */}
                        <div className="h-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>

                        {/* Gauge 2: Health */}
                        <div className="relative h-[90%] aspect-square flex flex-col items-center justify-center">
                            <HeroGauge value={health === 'Good' ? 98 : 74} label="System Health" color={healthColor} />
                        </div>
                    </>
                )}
            </div>

            {/* 3. LINE STATUS HERO (Right) */}
            <div className="flex justify-end items-center gap-8 lg:w-[30%] h-full">
                {lineData && (
                    <div className="flex flex-col items-end justify-center h-full">
                        <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[9px] font-black text-slate-500 tracking-[0.3em] uppercase">STATUS INDICATOR</span>
                        </div>
                        <div className={`px-6 py-2 rounded-2xl bg-slate-950/50 border border-white/10 text-4xl lg:text-5xl font-black tracking-widest uppercase flex items-center gap-4 ${getStatusColor(status)} leading-none shadow-2xl`}>
                            {status}
                            <div className="relative flex h-5 w-5">
                                {status === 'Running' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-current shadow-[0_0_20px_currentColor] border-2 border-slate-900"></span>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 mt-2 tracking-widest">
                            UPTIME: <span className="text-white">14H 20M</span>
                        </div>
                    </div>
                )}
            </div>

            {/* MOBILE DROPDOWN MENU */}
            {mobileMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-[#0b1121] border-b border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-5 z-40">
                    {/* ... (Mobile menu remains same) ... */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select PD Code</label>
                        <select
                            value={selectedPD}
                            onChange={(e) => setSelectedPD(e.target.value)}
                            className="w-full p-4 bg-slate-900 border border-white/10 rounded-lg text-slate-200 outline-none font-bold text-lg"
                        >
                            {pdList.map(pd => <option key={pd} value={pd}>{pd}</option>)}
                        </select>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Line Code</label>
                        <select
                            value={selectedLine}
                            onChange={(e) => {
                                onLineChange(e.target.value);
                                setMobileMenuOpen(false);
                            }}
                            className="w-full p-4 bg-slate-900 border border-white/10 rounded-lg text-cyan-400 font-bold outline-none text-lg"
                        >
                            {lineList.map(line => <option key={line} value={line}>{line}</option>)}
                        </select>
                    </div>
                </div>
            )}

        </header>
    );
};

export default TopBar;
