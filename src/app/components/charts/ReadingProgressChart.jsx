"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function ReadingProgressChart({ monthly = [] }) {
  return (
    <Bar
      data={{
        labels: monthly.map((m) => m.month),
        datasets: [
          {
            label: "Books Read",
            data: monthly.map((m) => m.count),
            backgroundColor: "rgba(16, 185, 129, 0.7)",
            borderRadius: 8,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
    />
  );
}
