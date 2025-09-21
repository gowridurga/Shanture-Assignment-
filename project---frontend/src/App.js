import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard'; // fixed path
import Reports from './components/Reports';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const pageComponents = {
    dashboard: <Dashboard />,
    reports: <Reports />,
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      <main style={{ padding: '16px', minHeight: 'calc(100vh - 64px)' }}>
        {pageComponents[currentPage] || <Dashboard />}
      </main>
    </ThemeProvider>
  );
}

export default App;


