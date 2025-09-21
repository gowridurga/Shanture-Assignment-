import React from 'react';
import { Box, Typography, Breadcrumbs, Link } from '@mui/material';
import { NavigateNext } from '@mui/icons-material';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions,
  children 
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          sx={{ mb: 1 }}
        >
          {breadcrumbs.map((crumb, index) => (
            <Link
              key={index}
              color={index === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
              href={crumb.href}
              underline={index === breadcrumbs.length - 1 ? 'none' : 'hover'}
            >
              {crumb.label}
            </Link>
          ))}
        </Breadcrumbs>
      )}
      
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="flex-start"
        flexWrap="wrap"
        gap={2}
      >
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        
        {actions && (
          <Box display="flex" gap={1} flexWrap="wrap">
            {actions}
          </Box>
        )}
      </Box>
      
      {children}
    </Box>
  );
};

export default PageHeader;