import { MultiChoiceOption } from '@/api/presentation';
import { SlideType } from '@/utils/constants';

export interface BasicSlide {
  title: string;
  subTitle?: string;
}

export interface HeadingSlide extends BasicSlide {
  type: SlideType.Heading;
  background?: string;
}

export interface MultiChoiceSlide extends BasicSlide {
  type: SlideType.MultipleChoice;
  time: number;
  options: MultiChoiceOption[];
}

export type Slide = HeadingSlide | MultiChoiceSlide;
