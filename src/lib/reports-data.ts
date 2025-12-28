import { initialMaterials } from '@/lib/data';

// Generate more detailed mock data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
export const trendData = months.map(month => {
    const monthData: { [key: string]: string | number } = { month };
    initialMaterials.forEach(material => {
        // Simulate some trend data
        const randomFactor = (Math.random() - 0.2) * 0.3;
        const trendValue = material.currentStock * (1 + (months.indexOf(month) * 0.05) + randomFactor);
        monthData[material.name] = Math.max(0, Math.round(trendValue));
    });
    return monthData;
});

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(220, 70%, 50%)',
    'hsl(100, 60%, 45%)',
    'hsl(340, 80%, 55%)',
    'hsl(40, 75%, 60%)',
    'hsl(180, 75%, 55%)',
];

export const chartConfig = initialMaterials.reduce((config, material, index) => {
    config[material.name] = {
        label: material.name,
        color: chartColors[index % chartColors.length],
    };
    return config;
}, {} as any);
