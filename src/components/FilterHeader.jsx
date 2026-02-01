import React from 'react';
import { Search, MapPin, Factory, ChevronDown } from 'lucide-react';

const FilterHeader = ({ onLineChange, selectedLine, selectedPD, setSelectedPD, pdList, lineList }) => {
    return (
        <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Branding */}
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                        <Factory className="text-blue-500 w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-wide font-display">Predictive Maintenance</h1>
                        <p className="text-xs text-slate-400 font-medium">Dashboard v2.0</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {/* PD Code Selector */}
                    <div className="relative group w-full sm:w-56">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                        </div>
                        <select
                            value={selectedPD}
                            onChange={(e) => setSelectedPD(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all hover:border-slate-600 cursor-pointer"
                        >
                            <option value="" disabled>Select PD Code</option>
                            {pdList.map(pd => (
                                <option key={pd} value={pd}>{pd}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>

                    {/* Line Code Selector */}
                    <div className="relative group w-full sm:w-56">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <select
                            value={selectedLine}
                            onChange={(e) => onLineChange(e.target.value)}
                            className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none appearance-none transition-all hover:border-slate-600 cursor-pointer"
                        >
                            <option value="" disabled>Select Line Code</option>
                            {lineList.map(line => (
                                <option key={line} value={line}>{line}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                            <ChevronDown className="w-4 h-4 text-slate-500" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default FilterHeader;
