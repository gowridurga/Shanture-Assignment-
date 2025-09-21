import React from "react";
import ReactECharts from "echarts-for-react";

export default function RegionPieChart({ regionStats = {} }) {
  const data = Object.entries(regionStats).map(([k, v]) => ({ name: k, value: v }));
  const option = {
    title: { text: "Region-wise Sales" },
    tooltip: { trigger: "item" },
    series: [{ type: "pie", radius: "50%", data }],
  };
  return <ReactECharts option={option} style={{ height: 300 }} />;
}