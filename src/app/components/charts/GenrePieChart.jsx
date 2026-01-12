"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GenrePieChart({ data = [] }) {
  return (
    <Pie
      data={{
        labels: data.map((d) => d.genre),
        datasets: [
          {
            data: data.map((d) => d.count),
            backgroundColor: [
              "#7A8450",
              "#5C4033",
              "#F5F1E6",
              "#3f4f46",
              "#a16207",
            ],
          },
        ],
      }}
    />
  );
}
