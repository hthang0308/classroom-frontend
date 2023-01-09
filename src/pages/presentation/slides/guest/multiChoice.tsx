import { Button, Title, Stack } from '@mantine/core';
import { useState } from 'react';

import { MultiChoiceOption } from '@/api/presentation';

import MultiChoiceDisplaySlide from '@/pages/presentation/slides/host/multiChoice';

interface DisplayMultiChoiceSlideProps {
  title: string;
  options: MultiChoiceOption[];
  sendVote: (_: MultiChoiceOption) => void;
}

export default function DisplayMultiChoiceSlide({ sendVote, options, title }: DisplayMultiChoiceSlideProps) {
  const [voteValue, setVoteValue] = useState<MultiChoiceOption>();

  const handleVote = (option: MultiChoiceOption) => {
    setVoteValue(option);
    sendVote(option);
  };

  return (
    voteValue ? (
      <MultiChoiceDisplaySlide title={title} options={options} />
    ) : (
      <Stack spacing="xl">
        <Title order={1} align="center">{title}</Title>
        <Stack align="center" justify="flex-start">
          {
            options.map((o) => (
              <Button
                key={`${o.index}__${o.value}`}
                onClick={() => handleVote(o)}
                w={500}
                size="xl"
              >
                {o.value}
              </Button>
            ))
          }
        </Stack>
      </Stack>
    )
  );
}
