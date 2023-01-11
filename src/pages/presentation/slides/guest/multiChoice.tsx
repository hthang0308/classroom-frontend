import { Button, Title, Stack } from '@mantine/core';
import { useEffect, useState, useMemo } from 'react';

import { UserVote } from '../../active/types';

import { MultiChoiceOption } from '@/api/presentation';

import MultiChoiceDisplaySlide from '@/pages/presentation/slides/host/multiChoice';

import { getUserId } from '@/utils';

interface DisplayMultiChoiceSlideProps {
  title: string;
  userVotes: UserVote[] | undefined,
  options: MultiChoiceOption[];
  sendVote: (_: MultiChoiceOption) => void;
}

export default function DisplayMultiChoiceSlide({ sendVote, userVotes, options, title }: DisplayMultiChoiceSlideProps) {
  const [voteValue, setVoteValue] = useState<MultiChoiceOption>();

  const currentUserId = useMemo(() => getUserId(), []);

  const handleVote = (option: MultiChoiceOption) => {
    setVoteValue(option);
    sendVote(option);
  };

  useEffect(() => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    setVoteValue(undefined);
  }, [title]);

  return (
    (voteValue || userVotes?.find((i) => i.user._id === currentUserId)) ? (
      <MultiChoiceDisplaySlide title={title} options={options} />
    ) : (
      <Stack spacing="xl">
        <Title order={1} align="center">
          {title}
        </Title>
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
