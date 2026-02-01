import React, { useState } from 'react';
import { Search, MapPin, Factory } from 'lucide-react';

const mockPDs = ['PD-001', 'PD-002', 'PD-003', 'PD-004'];
const mockLines = ['Line-A1', 'Line-A2', 'Line-B1', 'Line-B2'];

const Header = ({ onLineChange, selectedLine, selectedPD, setSelectedPD }) => {
    return (
        <header className="bg-slate-900 border-b border-slate-800 p-4 shadow-lg shadow-black/20 z-10 sticky top-0">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Factory className="text-blue-500 w-8 h-8" />
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-wide">Predictive Maintenance</h1>
                        <p className="text-xs text-slate-400">Manufacturing Line Dashboard</p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* PD Code Selector */}
                    <div className="relative group w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                            value={selectedPD}
                            onChange={(e) => setSelectedPD(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 bg-slate-800 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all hover:bg-slate-750"
                        >
                            <option value="" disabled>Select PD Code</option>
                            {mockPDs.map(pd => (
                                <option key={pd} value={pd}>{pd}</option>
                            ))}
                        </select>
                    </div>

                    {/* Line Code Selector */}
                    <div className="relative group w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400" />
                        </div>
                        <select
                            value={selectedLine}
                            onChange={(e) => onLineChange(e.target.value)}
                            className="block w-full pl-10 pr-4 py-2 bg-slate-800 border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none transition-all hover:bg-slate-750"
                        >
                            <option value="" disabled>Select Line Code</option>
                            {mockLines.map(line => (
                                <option key={line} value={line}>{line}</option>
                            ))}
                        </select>
                        {/* Custom arrow could act here but select handles it natively generally, though hidden by appearance-none. Let's add an arrow manually */}
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
