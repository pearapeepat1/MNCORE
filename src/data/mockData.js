export const DASHBOARD_DATA = {
    "Line-A1": {
        lineId: "Line-A1",
        pdCode: "PD-001",
        lineName: "Main Assembly Alpha",
        description: "High-speed automated assembly line for Series A components.",
        currentShift: "Shift 1 (06:00 - 14:00)",
        status: "Running", // Running, Stopped, Idle
        health: "Good", // Good, Warning, Critical
        efficiency: 92,
        operations: [
            { id: "op-10", name: "OP-10", type: "Loading", mtbf: 1450, mttr: 12, downtime: 0, status: "Running" },
            { id: "op-20", name: "OP-20", type: "Welding", mtbf: 850, mttr: 45, downtime: 0, status: "Running" },
            { id: "op-30", name: "OP-30", type: "Assembly", mtbf: 1200, mttr: 25, downtime: 5, status: "Warning" },
            { id: "op-40", name: "OP-40", type: "Testing", mtbf: 2000, mttr: 10, downtime: 0, status: "Running" },
            { id: "op-50", name: "OP-50", type: "Packing", mtbf: 1800, mttr: 15, downtime: 0, status: "Running" }
        ],
        spareParts: [
            { id: "sp-01", name: "Servo Motor M-22", usage: 3, lastReplaced: "2024-01-15" },
            { id: "sp-02", name: "Hydraulic Seal Kit", usage: 8, lastReplaced: "2024-02-10" },
            { id: "sp-03", name: "Prox Sensor X5", usage: 12, lastReplaced: "2024-02-28" }
        ],
        maintenanceLogs: [
            { id: "log-01", action: "Replaced Conveyor Belt", date: "2024-03-01", technician: "J. Doe" },
            { id: "log-02", action: "Calibrated Welding Arm", date: "2024-02-25", technician: "A. Smith" },
            { id: "log-03", action: "Software Update v2.1", date: "2024-02-20", technician: "SysAdmin" }
        ]
    },
    "Line-A2": {
        lineId: "Line-A2",
        pdCode: "PD-001",
        lineName: "Sub-Assembly Beta",
        description: "Manual and semi-automated sub-assembly line.",
        currentShift: "Shift 2 (14:00 - 22:00)",
        status: "Idle",
        health: "Warning",
        efficiency: 78,
        operations: [
            { id: "op-10", name: "OP-10", type: "Cutting", mtbf: 600, mttr: 30, downtime: 15, status: "Warning" },
            { id: "op-20", name: "OP-20", type: "Drilling", mtbf: 800, mttr: 20, downtime: 0, status: "Running" },
            { id: "op-30", name: "OP-30", type: "Finishing", mtbf: 500, mttr: 60, downtime: 120, status: "Stopped" }
        ],
        spareParts: [
            { id: "sp-04", name: "Drill Bit Set 5mm", usage: 45, lastReplaced: "2024-03-05" },
            { id: "sp-05", name: "Coolant Filter", usage: 2, lastReplaced: "2024-01-20" }
        ],
        maintenanceLogs: [
            { id: "log-04", action: "Spindle Lubrication", date: "2024-03-02", technician: "M. Brown" },
            { id: "log-05", action: "Emergency Stop Check", date: "2024-03-01", technician: "Safety Team" }
        ]
    },
    "Line-B1": {
        lineId: "Line-B1",
        pdCode: "PD-002",
        lineName: "Packaging Line Delta",
        description: "Final packaging and palletizing unit.",
        currentShift: "Shift 1 (06:00 - 14:00)",
        status: "Stopped",
        health: "Critical",
        efficiency: 0,
        operations: [
            { id: "op-10", name: "OP-10", type: "Boxing", mtbf: 3000, mttr: 10, downtime: 240, status: "Stopped" },
            { id: "op-20", name: "OP-20", type: "Labeling", mtbf: 2500, mttr: 5, downtime: 240, status: "Stopped" },
            { id: "op-30", name: "OP-30", type: "Palletizing", mtbf: 1000, mttr: 90, downtime: 240, status: "Stopped" }
        ],
        spareParts: [
            { id: "sp-06", name: "Label Printer Head", usage: 1, lastReplaced: "2023-12-10" }
        ],
        maintenanceLogs: [
            { id: "log-06", action: "Motor Overheat Reset", date: "2024-03-06", technician: "Power Team" },
            { id: "log-07", action: "Belt Tensioning", date: "2024-02-15", technician: "J. Doe" }
        ]
    }
};

export const MOCK_PDS = ['PD-001', 'PD-002', 'PD-003'];
export const MOCK_LINES = ['Line-A1', 'Line-A2', 'Line-B1'];
