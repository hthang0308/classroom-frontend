import { Button, SimpleGrid, Text, Title } from '@mantine/core';
import React, { useState } from 'react';

import { MultiChoiceOption } from '@/api/presentation';

interface DisplayMultiChoiceSlideProps {
  title: string;

  options: MultiChoiceOption[];
  sendVote: (_: MultiChoiceOption) => void;
}

export default function DisplayMultiChoiceSlide({ sendVote, options, title }: DisplayMultiChoiceSlideProps) {
  const [voteValue, setVoteValue] = useState<MultiChoiceOption>();

  return (
    <>
      <Title order={3} sx={{ textAlign: 'center' }}>{title}</Title>
      {
        voteValue ? (
          <Text sx={{ textAlign: 'center' }}>
            You voted for
            {' '}
            {voteValue.value}
          </Text>
        ) : (
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              {
                maxWidth: 980, cols: 3, spacing: 'md',
              },
              {
                maxWidth: 755, cols: 2, spacing: 'sm',
              },
              {
                maxWidth: 600, cols: 1, spacing: 'sm',
              },
            ]}
          >
            {
              options.map((o) => (
                <Button
                  key={`${o.index}__${o.value}`}
                  onClick={() => sendVote(o)}
                >
                  {o.value}
                </Button>
              ))
            }
          </SimpleGrid>
        )
      }
    </>
  );
}
