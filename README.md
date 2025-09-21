# FullStack Project

## Project Overview
This is a full-stack web application with a **React frontend** and a **Node.js/Express backend**.  
The application provides analytics, dashboard, and reporting features for users.

---

project---frontend/ # React frontend
project---backend/ # Node.js + Express backend

.env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=mydb

1. Navigate to the backend folder:
cd project---backend

2.Navigate to the frontend folder:
cd project---frontend

Install dependencies:
npm install

Start the frontend server:
npm start
The React app should run at http://localhost:3000

API Endpoints:
GET /reports/:userId – Fetch reports for a user
POST /reports – Generate a new report
GET /dashboard – Fetch dashboard metrics

Technologies Used:
Frontend: React, Material-UI, Axios, Day.js
Backend: Node.js, Express, Sequelize (or your DB ORM)
Database: SQLite / MySQL / PostgreSQL
Charts: ECharts (via echarts-for-react)











