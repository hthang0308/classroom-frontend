import { MultiChoiceOption } from '@/api/presentation';
import { SlideTypes } from '@/utils/constants';

export interface BasicSlide {
  title: string;
  subTitle?: string;
}

export interface HeadingSlide extends BasicSlide {
  type: typeof SlideTypes.heading;
  background?: string;
}

export interface MultiChoiceSlide extends BasicSlide {
  type: typeof SlideTypes.multipleChoice;
  time: number;
  options: MultiChoiceOption[];
}

export type Slide = HeadingSlide | MultiChoiceSlide;
