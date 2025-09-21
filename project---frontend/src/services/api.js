import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

export const fetchReport = (startDate, endDate) =>
  API.get(`/analytics/report`, {
    params: { startDate, endDate },
  });

export const generateAndSaveReport = (payload) =>
  API.post(`/reports`, payload); 

export const fetchReportsByUser = (userId) =>
  API.get(`/reports/${userId}`); 

export default API;