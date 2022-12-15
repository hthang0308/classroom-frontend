import {
  BackgroundImage,
  Group, Stack, Title,
} from '@mantine/core';
import React from 'react';

import { HeadingSlide } from '@/pages/presentation/types';
import { isValidUrl } from '@/utils';

interface ColorBackgroundProps {
  color: string;
  children: React.ReactNode;
}

function ColorBackground({ color, children }: ColorBackgroundProps) {
  return (
    <div style={{ height: '100%', backgroundColor: color }}>
      {children}
    </div>
  );
}

interface ImageBackgroundProps {
  url: string;
  children: React.ReactNode;
}

function ImageBackground({ url, children }: ImageBackgroundProps) {
  return (
    <BackgroundImage sx={{ height: '100%' }} src={url}>
      {children}
    </BackgroundImage>
  );
}

export default function HeadingDisplaySlide(props: HeadingSlide) {
  const {
    title, subTitle, background,
  } = props;

  let Content = (
    <Group sx={{ height: '100%' }} position="center">
      <Stack align="center">
        <Title order={1}>{title}</Title>
        <Title order={3}>{subTitle}</Title>
      </Stack>
    </Group>
  );

  if (background) {
    Content = isValidUrl(background)
      ? <ImageBackground url={background}>{Content}</ImageBackground>
      : <ColorBackground color={background}>{Content}</ColorBackground>;
  }

  return Content;
}
