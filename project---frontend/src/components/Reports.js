import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import API from '../services/api';

import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState(dayjs().subtract(1, 'month'));
  const [endDate, setEndDate] = useState(dayjs());

  const fetchReports = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await API.get('/reports/demo-user-id'); // <-- FIXED
      setReports(response.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setGenerating(true);
      setError('');
      await API.post('/reports', { // <-- FIXED
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        userId: 'demo-user-id',
      });
      setDialogOpen(false);
      await fetchReports();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Analytics Reports
          </Typography>
          <Button
            variant="contained"
            onClick={() => setDialogOpen(true)}
            disabled={generating}
          >
            Generate New Report
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Generated Date</TableCell>
                <TableCell>Period</TableCell>
                <TableCell align="right">Total Revenue</TableCell>
                <TableCell align="right">Total Orders</TableCell>
                <TableCell align="right">Avg Order Value</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    {dayjs(report.createdAt).format('MMM DD, YYYY HH:mm')}
                  </TableCell>
                  <TableCell>
                    {dayjs(report.startDate).format('MMM DD, YYYY')} - {dayjs(report.endDate).format('MMM DD, YYYY')}
                  </TableCell>
                  <TableCell align="right">
                    ${parseFloat(report.totalRevenue || 0).toLocaleString()}
                  </TableCell>
                  <TableCell align="right">{report.totalOrders || 0}</TableCell>
                  <TableCell align="right">
                    ${parseFloat(report.avgOrderValue || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" variant="outlined">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No reports generated yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Generate New Analytics Report</DialogTitle>
          <DialogContent>
            <Box display="flex" gap={2} mt={2}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                maxDate={endDate}
              />
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate}
                maxDate={dayjs()}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={generateReport} 
              variant="contained"
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Report'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default Reports;
