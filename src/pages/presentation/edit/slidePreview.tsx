import { Text } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';

import { FormProps } from './types';

import HeadingDisplaySlide from '@/pages/presentation/slides/host/heading';
import MultiChoiceDisplaySlide from '@/pages/presentation/slides/host/multiChoice';
import ParagraphDisplaySlide from '@/pages/presentation/slides/host/paragraph';

import { SlideTypes } from '@/utils/constants';

interface SlidePreviewProps {
  type: string | null
  form: UseFormReturnType<FormProps>
}

const NoSlidePreview = () => <Text>No slide preview</Text>;

export default function SlidePreview({ type, form }: SlidePreviewProps) {
  let Slide = null;
  const props = {};

  switch (type) {
    case SlideTypes.multipleChoice: {
      Object.assign(props, {
        title: form.values.question,
        options: form.values.options,
        randomData: true,
      });
      Slide = MultiChoiceDisplaySlide;
      break;
    }

    case SlideTypes.heading: {
      Object.assign(props, {
        heading: form.values.heading,
        subHeading: form.values.subheading,
      });
      Slide = HeadingDisplaySlide;
      break;
    }

    case SlideTypes.paragraph: {
      Object.assign(props, {
        heading: form.values.heading,
        paragraph: form.values.paragraph,
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
