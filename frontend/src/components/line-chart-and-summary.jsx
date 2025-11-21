import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import AISummaryCard from './ai-summary-card';

// NOTE: Chart.js is loaded via CDN inside the useEffect hook.
// This approach is necessary for running within a single-file React component.

// --- API CONFIGURATION FOR GEMINI (Real) ---
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=`;
const RETRY_DELAY = 1000; 

const fetchWithBackoff = async (url, options, retries = 5) => {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
            const delay = RETRY_DELAY * Math.pow(2, i);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

// --- MOCK DATA ---
const DUMMY_SALES_DATA = [
    { month: 'Jan', value: 300 },
    { month: 'Feb', value: 450 },
    { month: 'Mar', value: 200 },
    { month: 'Apr', value: 600 },
    { month: 'May', value: 550 },
    { month: 'Jun', value: 800 },
    { month: 'Jul', value: 700 },
    { month: 'Aug', value: 950 },
];

/**
 * Line chart component using Chart.js for data visualization, now including an AI Summary.
 */
const ChartOutput = () => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [aiSummary, setAiSummary] = useState("Click 'Generate Analysis' to get an AI summary of this revenue trend.");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState(null);

    const totalRevenue = DUMMY_SALES_DATA.reduce((sum, d) => sum + d.value, 0);

    // Memoize the data payload for the AI API call
    const salesDataPayload = useMemo(() => DUMMY_SALES_DATA.map(d => ({
        month: d.month,
        revenue: d.value,
    })), []);


    useEffect(() => {
        // 1. Load Chart.js library dynamically
        const loadChartJs = (callback) => {
            if (window.Chart) {
                callback();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js';
            script.onload = callback;
            script.onerror = () => console.error("Failed to load Chart.js script.");
            document.head.appendChild(script);
        };

        // 2. Initialize the chart once Chart.js is loaded
        loadChartJs(() => {
            if (chartRef.current && window.Chart) {
                const ctx = chartRef.current.getContext('2d');
                
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const labels = DUMMY_SALES_DATA.map(d => d.month);
                const dataValues = DUMMY_SALES_DATA.map(d => d.value);

                // Create a gradient fill for the chart area
                const gradient = ctx.createLinearGradient(0, 0, 0, 200);
                gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)'); // Indigo 600 semi-transparent
                gradient.addColorStop(1, 'rgba(79, 70, 229, 0)');  // Transparent

                chartInstance.current = new window.Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Revenue ($)',
                            data: dataValues,
                            backgroundColor: gradient,
                            borderColor: '#4F46E5', // Indigo 600
                            borderWidth: 4,
                            pointRadius: 6,
                            pointBackgroundColor: '#FFFFFF',
                            pointBorderColor: '#4F46E5',
                            pointHoverRadius: 8,
                            fill: true,
                            tension: 0.4, // Smooth curve
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                            title: { display: false },
                            tooltip: {
                                bodyFont: { size: 14 },
                                callbacks: {
                                    label: function(context) {
                                        let label = context.dataset.label || '';
                                        if (label) { label += ': '; }
                                        if (context.parsed.y !== null) {
                                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: '#E5E7EB' },
                                ticks: {
                                    callback: function(value) {
                                        return '$' + value;
                                    }
                                }
                            },
                            x: {
                                grid: { display: false }
                            }
                        }
                    }
                });
            }
        });

        // Cleanup on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, []);

    return (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-2xl border border-gray-100 max-w-4xl mx-auto space-y-6">
            
            {/* Chart Area */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-inner border border-gray-100">
                <h2 className="text-2xl font-extrabold text-indigo-700 mb-2">Quarterly Performance Insight</h2>
                <p className="text-sm text-gray-500 mb-6">Revenue trend over the last 8 months using Chart.js.</p>
                <div className="relative h-64 w-full"> 
                    <canvas ref={chartRef} id="salesChart"></canvas>
                </div>
            </div>

            <div className="text-center pt-2">
                <p className="text-gray-700 font-medium">
                    Total Revenue (Mock): <span className="text-green-600 font-extrabold">${totalRevenue.toFixed(2)}</span>
                </p>
            </div>
        </div>
    );
};

export default ChartOutput;