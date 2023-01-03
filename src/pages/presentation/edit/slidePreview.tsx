import { Text } from '@mantine/core';

import HeadingDisplaySlide from '../slides/heading';
import MultiChoiceDisplaySlide from '../slides/multiChoice';
import ParagraphDisplaySlide from '../slides/paragraph';

import { CompactSlide } from '@/api/presentation';

import { SlideTypes } from '@/utils/constants';

interface SlidePreviewProps {
  type: string | null
  slideData: CompactSlide | undefined
}

const NoSlidePreview = () => <Text>No slide preview</Text>;

export default function SlidePreview({ type, slideData }: SlidePreviewProps) {
  let Slide = null;
  const props = {};

  switch (type) {
    case SlideTypes.multipleChoice: {
      Object.assign(props, {
        title: slideData?.title,
        options: slideData?.options,
        randomData: true,
      });
      Slide = MultiChoiceDisplaySlide;
      break;
    }

    case SlideTypes.heading: {
      Object.assign(props, {
        heading: slideData?.title,
        subHeading: slideData?.content,
      });
      Slide = HeadingDisplaySlide;
      break;
    }

    case SlideTypes.paragraph: {
      Object.assign(props, {
        heading: slideData?.title,
        paragraph: slideData?.content,
      });
      Slide = ParagraphDisplaySlide;
      break;
    }

    default: {
      Slide = NoSlidePreview;
    }
  }

  return <Slide {...props} />;
}
