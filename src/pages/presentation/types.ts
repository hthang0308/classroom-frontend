import { MultiChoiceOption } from '@/api/presentation';
import { SlideType } from '@/utils/constants';

export interface BasicSlide {
  title: string;
  subTitle?: string;
}

export interface HeadingSlide extends BasicSlide {
  type: typeof SlideType.heading;
  background?: string;
}

export interface MultiChoiceSlide extends BasicSlide {
  type: typeof SlideType.multipleChoice;
  time: number;
  options: MultiChoiceOption[];
}

export type Slide = HeadingSlide | MultiChoiceSlide;
