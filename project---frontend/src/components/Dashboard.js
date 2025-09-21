import React, { useEffect, useState } from "react";
import {
  Grid,
  Container,
  Typography,
  Stack,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import DateRangeSelector from "../components/DateRangeSelector";
import MetricCard from "../components/MetricCard";
import RevenueChart from "../components/RevenueChart";
import TopProductsChart from "../components/TopProductsChart";
import RegionPieChart from "./RegionPieChart.js";
import Reports from "../components/Reports";
import {
  fetchReport,
  generateAndSaveReport,
  fetchReportsByUser,
} from "../services/api";
import { formatCurrency } from "../utils/format";

export default function DashboardPage() {
  const [startDate, setStartDate] = useState(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reportsHistory, setReportsHistory] = useState([]);

  const userId = "demo-user-id"; 

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetchReportsByUser(userId);
        setReportsHistory(res.data.reports || []);
      } catch (err) {
        console.error(err);
      }
    };
    loadHistory();
  }, []);

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await fetchReport(
        startDate.toISOString(),
        endDate.toISOString()
      );
      const data = res.data || {};
      setReport(data);

      const payload = {
        userId,
        reportType: "custom",
        reportDate: new Date(),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalOrders: data.totalOrders || 0,
        totalRevenue: data.totalRevenue || 0,
        avgOrderValue: data.avgOrderValue || 0,
        topProducts: data.topProducts || [],
        topCustomers: data.topCustomers || [],
        regionWiseStats: data.regionWiseStats || {},
        categoryWiseStats: data.categoryWiseStats || {},
      };

      await generateAndSaveReport(payload);
      const hist = await fetchReportsByUser(userId);
      setReportsHistory(hist.data.reports || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch report. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const onLoadReport = (r) => {
    setReport(r.data || r);
  };

  const revenueSeries = (report && report.dailySeries) || [];
  const topProducts =
    (report && (report.topProductsArray || report.topProducts)) || [];
  const regionStats = (report && report.regionWiseStats) || {};

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
     
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <div>
          <Typography variant="h4" fontWeight={700}>
            Sales Analytics Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Track performance, revenue & customer insights
          </Typography>
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setStartDate(
              new Date(new Date().setMonth(new Date().getMonth() - 1))
            );
            setEndDate(new Date());
          }}
        >
          Last 30 Days
        </Button>
      </Stack>

      
      <Paper
        elevation={2}
        sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: "background.paper" }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onApply={handleApply}
          />
          <Button
            variant="outlined"
            disabled={loading}
            onClick={handleApply}
            sx={{ minWidth: 150, borderRadius: 2 }}
          >
            {loading ? "Loading..." : "Generate Report"}
          </Button>
        </Stack>
      </Paper>

      
     <Grid container spacing={3} mb={4}>
  <Grid item xs={12} md={3}>
    <MetricCard
      title="Total Revenue"
      value={formatCurrency(report?.totalRevenue || 0)}
      subtitle="Last 30 days"
      color="#4CAF50"
      icon="revenue"
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <MetricCard
      title="Total Orders"
      value={report?.totalOrders || 0}
      subtitle="Completed"
      color="#2196F3"
      icon="orders"
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <MetricCard
      title="Avg Order Value"
      value={formatCurrency(report?.avgOrderValue || 0)}
      subtitle="Per Order"
      color="#FF9800"
      icon="growth"
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <MetricCard
      title="Top Customers"
      value={(report?.topCustomers || []).slice(0, 3).join(", ")}
      subtitle="Recent"
      color="#9C27B0"
      icon="customers"
    />
  </Grid>
</Grid>


     
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <RevenueChart series={revenueSeries} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Stack spacing={3}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <TopProductsChart data={topProducts} />
            </Paper>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
              <RegionPieChart regionStats={regionStats} />
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      
      <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight={600}>
          Reports History
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Reports reports={reportsHistory} onLoadReport={onLoadReport} />
      </Paper>
    </Container>
  );
}
