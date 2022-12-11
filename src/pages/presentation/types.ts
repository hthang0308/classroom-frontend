
export interface BasicSlide {
  title: string;
  subTitle?: string;
}

export interface HeadingSlide extends BasicSlide {
  type: 'heading';
  background?: string;
}

export interface MultiChoiceValue {
  value: string;
  color?: string;
}

export interface MultiChoiceSlide extends BasicSlide {
  type: 'multi-choice';
  time: number;
  options: MultiChoiceValue[]
}

export type Slide = HeadingSlide | MultiChoiceSlide;
