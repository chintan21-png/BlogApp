
import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CustomTooltip from './CustomTooltip';
import CustomLegend from './CustomLegend';

const COLORS = ['#0096cc', '#00a9e6', '#00bcff', '#1ac3ff', '#33c9ff', '#4dd0ff', '#66d7ff'];

const CustomPieChart = ({ data, colors = COLORS }) => {
    if (!data || data.length === 0) {
        return (
            <div className='h-[280px] flex items-center justify-center text-gray-500'>
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie 
                    data={data} 
                    dataKey="count" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={80} 
                    innerRadius={40} 
                    paddingAngle={2}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell 
                            key={`cell-${index}`} 
                            fill={colors[index % colors.length]} 
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;