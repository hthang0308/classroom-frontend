import React from 'react';

import Chart from '@/pages/common/chart';
import { MultiChoiceSlide } from '@/pages/presentation/types';

const TestChart = () => (
  <Chart
    style={{ maxHeight: 360 }}
    type="bar"
    options={{
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            font: { size: 12 },
            color: '#4F4F4F',
          },
        },
        x: {
          ticks: {
            font: { size: 10 },
            color: '#4F4F4F',
          },
        },
      },

      plugins: {
        datalabels: {
          color: '#4F4F4F',
          anchor: 'end',
          align: 'top',
          formatter(value) {
            if (window.innerWidth < 600) {
              return null;
            }

            return value.toLocaleString();
          },
        },
        legend: {
          display: true,
          labels: {
            font: { size: 20 },
            color: '#4F4F4F',
          },
        },
      },
    }}
    data={{
      labels: ['a', 'b', 'c'],
      datasets: [{
        data: [1, 2, 3],
        backgroundColor: ['red', 'blue', 'green'],
      }],
    }}
  />
);

export default function MultiChoiceDisplaySlide(_props: MultiChoiceSlide) {
  return (
    <TestChart />
  );
}
