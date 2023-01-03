import { Center, Title, Stack } from '@mantine/core';
import { memo, useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Tooltip, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';

import BaseSlide from './baseSlide';

import { MultiChoiceOption } from '@/api/presentation';

import { Colors } from '@/utils/constants';

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
  const [data, setData] = useState<MultiChoiceOption[]>([]);

  useEffect(() => {
    if (randomData) {
      setData(options.map((i) => ({
        ...i,
        quantity: randInt(2, 10),
      })));
    } else {
      setData(options);
    }
  }, [randomData, options]);
  return (
    <BaseSlide>
      <Stack>
        <Center py="md">
          <Title order={1} align="center">{title}</Title>
        </Center>
        {
          data.length > 0
            ? (
              <ResponsiveContainer width="100%" height="80%">
                <BarChart
                  data={data}
                  margin={{
                    top: 35,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="value" style={{ fontSize: '32px' }} />
                  <YAxis style={{ fontSize: '24px' }} />
                  <Tooltip />
                  <Bar dataKey="quantity" label={{ fontSize: 40, position: 'top' }}>
                    {data.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={Colors[index % Colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )
            : (
              null
            )
        }
      </Stack>
    </BaseSlide>
  );
}

export default memo(MultiChoiceDisplaySlide);
