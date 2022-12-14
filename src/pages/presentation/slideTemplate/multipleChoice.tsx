import {
  Box, Title, AspectRatio, Stack, Flex,
} from '@mantine/core';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import { COLORS } from '@/utils/constants';

interface PropsType {
  question: string | undefined
  options: {
    value: string
    quantity?: number
  }[] | undefined
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
);

export default function MultipleChoiceSlideTemplate({ question, options }: PropsType) {
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <AspectRatio bg="white" ratio={16 / 9}>
      <Stack spacing="xl">
        <Box mah="35%">
          <Title order={2} align="center">
            {question || ''}
          </Title>
        </Box>
        <Flex h="65%" w="100%" justify="center" align="center">
          <Bar
            options={chartOptions}
            data={{
              labels: options?.map((i) => i.value),
              datasets: [{
                data: options?.map((i) => i.quantity || 0),
                backgroundColor: COLORS.slice(0, options?.length),
              }],
            }}
          />
        </Flex>
      </Stack>
    </AspectRatio>
  );
}
