import { Button, Text, Title, Stack } from '@mantine/core';
import { useState } from 'react';

import { MultiChoiceOption } from '@/api/presentation';

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
    <Stack spacing="xl">
      <Title order={1} align="center">{title}</Title>
      {
        voteValue ? (
          <Text size="lg" align="center">
            {`You voted for ${voteValue.value}`}
          </Text>
        ) : (
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
        )
      }
    </Stack>
  );
}
