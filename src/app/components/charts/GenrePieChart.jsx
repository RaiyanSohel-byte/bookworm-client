"use client";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

export default function GenrePieChart({ data = [] }) {
  return (
    <Pie
      data={{
        labels: data.map((d) => d.genre),
        datasets: [
          {
            label: "Books per Genre",
            data: data.map((d) => d.count),
            backgroundColor: [
              "#4ADE80",
              "#22D3EE",
              "#FBBF24",
              "#F87171",
              "#A78BFA",
              "#F472B6",
            ],
            borderColor: "#fff",
            borderWidth: 1,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "right" },
          title: { display: true, text: "Books per Genre" },
        },
      }}
    />
  );
}
