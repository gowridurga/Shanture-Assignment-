import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Assessment, 
  People, 
  Inventory, 
  ShoppingCart,
  MoreVert
} from '@mui/icons-material';

const Navigation = ({ currentPage, onPageChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'reports', label: 'Reports', icon: <Assessment /> },
    { id: 'customers', label: 'Customers', icon: <People /> },
    { id: 'products', label: 'Products', icon: <Inventory /> },
    { id: 'sales', label: 'Sales', icon: <ShoppingCart /> },
  ];

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Sales Analytics
        </Typography>
        
        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {menuItems.map((item) => (
            <Button
              key={item.id}
              color="inherit"
              startIcon={item.icon}
              onClick={() => onPageChange(item.id)}
              sx={{ 
                backgroundColor: currentPage === item.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                mx: 0.5
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* Mobile Navigation */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
          >
            {menuItems.map((item) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  handleMenuClose();
                }}
                selected={currentPage === item.id}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {item.icon}
                  {item.label}
                </Box>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;