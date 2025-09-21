import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';

const Navigation = ({ currentPage, onPageChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD' },
    { id: 'reports', label: 'REPORTS' }
  ];

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sales Analytics
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              sx={{ 
                color: '#fff',
                backgroundColor: currentPage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                },
                fontWeight: 'bold',
                px: 2
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
