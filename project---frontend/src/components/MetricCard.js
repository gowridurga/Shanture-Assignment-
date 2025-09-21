import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const MetricCard = ({ title, value, color = 'primary' }) => {
  const getColor = () => {
    switch (color) {
      case 'primary': return '#1976d2';
      case 'secondary': return '#dc004e';
      case 'success': return '#2e7d32';
      default: return '#1976d2';
    }
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" component="h2" sx={{ color: getColor() }}>
            {value}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
