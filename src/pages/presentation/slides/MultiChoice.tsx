import randomColor from 'randomcolor';
import React from 'react';

import Chart from '@/pages/common/chart';
import { MultiChoiceSlide } from '@/pages/presentation/types';

export default function MultiChoiceDisplaySlide({ title, options }: MultiChoiceSlide) {
  const backgroundColor = options.map(({ color }) => color || randomColor());

  return (
    <div>
      <Chart
        type="bar"
        options={{
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
                font: { size: 15 },
                color: '#4F4F4F',
              },
            },
            x: {
              ticks: {
                font: { size: 15 },
                color: '#4F4F4F',
              },
            },
          },
          plugins: {
            datalabels: { color: 'white' },
            title: {
              display: true,
              text: title,
            },
            legend: { display: false },
          },
        }}
        data={{
          labels: options.map(({ value }) => value),
          datasets: [{
            data: options.map(({ quantity }) => quantity || 0),
            backgroundColor,
          }],
        }}
      />
    </div>
  );
}
