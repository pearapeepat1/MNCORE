import { useState, useEffect } from 'react';

const useDashboardScale = () => {
    const [cols, setCols] = useState(3);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsMobile(width < 768);

            if (width < 640) {
                setCols(1);
            } else if (width < 1024) {
                setCols(2);
            } else if (width < 1536) {
                setCols(3);
            } else {
                setCols(5); // Ultra-wide / 4K
            }
        };

        handleResize(); // Init
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return { cols, isMobile };
};

export default useDashboardScale;
