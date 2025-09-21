import React from 'react';
import { Alert, AlertTitle, Button, Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';

const ErrorAlert = ({ error, onRetry, title = 'Error' }) => {
  return (
    <Alert 
      severity="error" 
      sx={{ mb: 2 }}
      action={
        onRetry && (
          <Button
            color="inherit"
            size="small"
            onClick={onRetry}
            startIcon={<Refresh />}
          >
            Retry
          </Button>
        )
      }
    >
      <AlertTitle>{title}</AlertTitle>
      {error}
    </Alert>
  );
};

export default ErrorAlert;