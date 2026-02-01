import React from 'react';
import { Package, Wrench, Calendar, ClipboardList } from 'lucide-react';

const MaintenanceSection = ({ spareParts, maintenanceLogs }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">

            {/* Spare Parts Table (Span 2) */}
            <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Package className="text-purple-400 w-5 h-5" /> Spare Parts Usage
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Top Consumables</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-slate-900/40">
                                <th className="p-4 font-medium">Part Name</th>
                                <th className="p-4 font-medium">ID</th>
                                <th className="p-4 font-medium">Frequency</th>
                                <th className="p-4 font-medium">Last Replaced</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm divide-y divide-slate-800/50">
                            {spareParts && spareParts.length > 0 ? (
                                spareParts.map((part) => (
                                    <tr key={part.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="p-4 font-medium text-slate-200 group-hover:text-white">{part.name}</td>
                                        <td className="p-4 text-slate-500 font-mono text-xs">{part.id}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-bold ${part.usage > 10 ? 'text-rose-400' : 'text-slate-300'}`}>{part.usage}</span>
                                                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${part.usage > 10 ? 'bg-rose-500' : 'bg-purple-500'}`}
                                                        style={{ width: `${Math.min(part.usage * 5, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400">{part.lastReplaced}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-slate-500 italic">No spare parts data recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Maintenance Logs (Span 1) */}
            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/20">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <ClipboardList className="text-blue-400 w-5 h-5" /> Maintenance Logs
                    </h3>
                    <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All</button>
                </div>

                <div className="p-0">
                    {maintenanceLogs && maintenanceLogs.length > 0 ? (
                        <div className="divide-y divide-slate-800/50">
                            {maintenanceLogs.map((log) => (
                                <div key={log.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[32px] w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                            <Wrench className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-200 mb-0.5">{log.action}</p>
                                            <div className="flex items-center gap-3 text-xs text-slate-500">
                                                <span className="flex items-center gap-1"><Calendar size={10} /> {log.date}</span>
                                                <span className="text-slate-600">•</span>
                                                <span>{log.technician}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500 italic">No maintenance logs available.</div>
                    )}

                    {/* Quick Action */}
                    <div className="p-4 border-t border-slate-800 mt-auto bg-slate-900/20">
                        <button className="w-full py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all">
                            Log New Maintenance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceSection;
