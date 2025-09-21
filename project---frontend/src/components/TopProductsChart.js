import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopProductsChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: '300px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#666' 
      }}>
        No product data available
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item?.productName || 'Unknown',
    revenue: item?.totalRevenue || 0
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        layout="horizontal"
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickFormatter={(value) => `$${(value / 1000)}K`} />
        <YAxis dataKey="name" type="category" width={100} />
        <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
        <Bar dataKey="revenue" fill="#FF6B6B" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TopProductsChart;