"use client";
import { Bar } from "react-chartjs-2";

export default function ReadingProgressChart({ monthly }) {
  return (
    <Bar
      data={{
        labels: monthly.map((m) => m.month),
        datasets: [
          {
            label: "Books Read",
            data: monthly.map((m) => m.count),
          },
        ],
      }}
    />
  );
}
