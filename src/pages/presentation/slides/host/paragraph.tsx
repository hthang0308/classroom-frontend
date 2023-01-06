import {
  Stack, Title, Text, ScrollArea,
} from '@mantine/core';

import BaseSlide from './baseSlide';

interface ParagraphDisplaySlideProps {
  heading?: string
  paragraph?: string
}

export default function ParagraphDisplaySlide({
  heading = '', paragraph = '',
}: ParagraphDisplaySlideProps) {
  return (
    <BaseSlide>
      <Stack align="center">
        <Title order={1} align="center">{heading}</Title>
        <ScrollArea>
          <Text size="xl" px="xl" mx="xl" sx={() => ({ whiteSpace: 'pre-wrap' })}>{paragraph}</Text>
        </ScrollArea>
      </Stack>
    </BaseSlide>
  );
}
