import { SlideType } from '@/utils/constants';

export interface BasicSlide {
  title: string;
  subTitle?: string;
}

export interface HeadingSlide extends BasicSlide {
  type: SlideType.Heading;
  background?: string;
}

export interface MultiChoiceValue {
  value: string;
  color?: string;
}

export interface MultiChoiceSlide extends BasicSlide {
  type: SlideType.MultipleChoice;
  time: number;
  options: MultiChoiceValue[];
}

export type Slide = HeadingSlide | MultiChoiceSlide;
