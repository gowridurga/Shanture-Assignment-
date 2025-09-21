import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const RevenueChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#666' 
      }}>
        No revenue data available
      </div>
    );
  }

  const chartData = data.map(item => ({
    period: item?.period || 'N/A',
    revenue: item?.revenue || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="period" />
        <YAxis tickFormatter={(value) => `$${(value / 1000)}K`} />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
        <Line 
          type="monotone" 
          dataKey="revenue" 
          stroke="#1976d2" 
          strokeWidth={3}
          dot={{ fill: '#1976d2' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RevenueChart;