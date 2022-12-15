import randomColor from 'randomcolor';
import React, { memo } from 'react';

import { MultiChoiceOption } from '@/api/presentation';
import Chart from '@/pages/common/chart';

interface MultiChoiceDisplaySlideProps {
  title?: string;
  randomData?: boolean;
  options?: MultiChoiceOption[];
}

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

function MultiChoiceDisplaySlide({
  title = '', options = [], randomData = false,
}: MultiChoiceDisplaySlideProps) {
  const backgroundColor = options.map(({ color }) => color || randomColor());
  const data = options.map(({ quantity }) => (randomData ? randInt(0, 5) : quantity || 0));

  return (
    <Chart
      type="bar"
      options={{
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
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
          datalabels: {
            color: 'white',
            borderColor: 'black',
            font: { size: 40 },
          },
          title: {
            display: true,
            text: title,
            font: { size: 30 },
          },
          legend: { display: false },
        },
      }}
      data={{
        labels: options.map(({ value }) => value),
        datasets: [{ data, backgroundColor }],
      }}
    />
  );
}

export default memo(MultiChoiceDisplaySlide);
