import React, { useState, useEffect } from 'react';
import NexusHeader from './NexusHeader';
import OperationMatrix from './OperationMatrix';
import AnalyticsTier from './AnalyticsTier';
import Footer from './Footer';

// Data Imports
import { DASHBOARD_DATA, MOCK_PDS, MOCK_LINES } from '../data/mockData';

const MegaDashboard = () => {
    // --- 1. State Management ---
    const [selectedPD, setSelectedPD] = useState(MOCK_PDS[0]); // Default PD-001
    const [selectedLine, setSelectedLine] = useState(MOCK_LINES[0]); // Default Line-A1

    // State for the active data being displayed. 
    // We initialize it with the default line's data.
    const [activeData, setActiveData] = useState(DASHBOARD_DATA[selectedLine]);

    // Derived state: Available lines for the selected PD
    // In a real app, this would come from a relational mapping. 
    // For this mock, we'll just filter MOCK_LINES based on a simple logic or show all.
    // The 'DASHBOARD_DATA' has 'pdCode' in it, so we can filter by that.
    const availableLines = Object.values(DASHBOARD_DATA)
        .filter(line => line.pdCode === selectedPD)
        .map(line => line.lineId);

    // Fallback: if no lines match (mock data gap), show all or handle gracefully.
    const finalAvailableLines = availableLines.length > 0 ? availableLines : MOCK_LINES;

    // --- 2. FA Integration Simulation (Logic Layer) ---
    const fetchLineStatus = () => {
        // Simulate fetching latest status from FA Server
        // In a real app, this would be an API call: await fetch(`/api/status/${selectedLine}`)

        // For specific simulation, we can toggle status or just re-read the latest mock data
        // to simulate a refresh.
        console.log(`[FA_SIMULATOR] Fetching live status for ${selectedLine}...`);

        // Here we just ensure we have the latest data from our 'backend' (mockData)
        // If we wanted to simulate dynamic changes, we could randomize something here.
        return DASHBOARD_DATA[selectedLine];
    };

    // Effect: When Line or PD changes, or on Interval
    useEffect(() => {
        // 1. Reset Line if it doesn't belong to new PD (Optional UX choice)
        // For now, if current selectedLine is not in availableLines, switch to first available.
        if (!availableLines.includes(selectedLine) && availableLines.length > 0) {
            setSelectedLine(availableLines[0]);
            return; // The change in selectedLine will trigger this effect again
        }

        // 2. Fetch Data
        const newData = fetchLineStatus();
        setActiveData(newData);

        // 3. Set up Polling Loop for "Live" feel
        const intervalId = setInterval(() => {
            // In a real app, we might poll every 5s. 
            // For this demo, we just log or maybe randomize a value slightly (optional).
            const liveData = fetchLineStatus();
            // Optional: Simulate minor jitter in efficiency to make it feel alive
            // liveData.efficiency = Math.min(100, Math.max(0, liveData.efficiency + (Math.random() > 0.5 ? 1 : -1)));
            setActiveData({ ...liveData });
        }, 5000);

        return () => clearInterval(intervalId);
    }, [selectedPD, selectedLine, availableLines]); // Dependency array


    // Safe guard if data is missing
    if (!activeData) return <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-white">Loading Vision System...</div>;

    return (
        <main className="h-screen w-screen overflow-hidden bg-[#020617] flex flex-col text-slate-200 selection:bg-cyan-500/30">

            {/* 1. Header (15%) - Passed Setters for Logic Layer Control */}
            <NexusHeader
                data={activeData}
                pdList={MOCK_PDS}
                lineList={finalAvailableLines}
                selectedPD={selectedPD}
                selectedLine={selectedLine}
                onSelectPD={setSelectedPD}
                onSelectLine={setSelectedLine}
            />

            {/* 2. Operation Modules (50%) - Dynamic Rendering */}
            {/* The component handles rendering N boxes based on array length */}
            <OperationMatrix operations={activeData.operations} />

            {/* 3. Analytics & Intelligence (31%) - Context Aware */}
            <AnalyticsTier
                spareParts={activeData.spareParts}
                logs={activeData.maintenanceLogs}
            />

            {/* 4. Footer (4%) */}
            <Footer />

        </main>
    );
};

export default MegaDashboard;
