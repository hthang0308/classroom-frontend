import {
  BackgroundImage, Stack, Title,
} from '@mantine/core';

import React from 'react';

import BaseSlide from './baseSlide';

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

interface HeadingDisplaySlideProps {
  heading?: string
  subHeading?: string
  background?: string
}

export default function HeadingDisplaySlide({
  heading = '', subHeading = '', background = '',
}: HeadingDisplaySlideProps) {
  let Content = (
    <BaseSlide>
      <Stack align="center">
        <Title order={1} align="center">{heading}</Title>
        <Title order={3} px="xl" mx="xl" align="center">{subHeading}</Title>
      </Stack>
    </BaseSlide>
  );

  if (background) {
    Content = isValidUrl(background)
      ? <ImageBackground url={background}>{Content}</ImageBackground>
      : <ColorBackground color={background}>{Content}</ColorBackground>;
  }

  return Content;
}
