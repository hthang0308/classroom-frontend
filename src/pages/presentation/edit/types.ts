import { SlideTypesType } from '@/utils/constants';

export interface SlideInfo {
  id: string
  label: string
  title: string
  subtitle?: string
  url: string
  type: SlideTypesType
}

export interface FormProps {
  question: string
  options: {
    value: string
    quantity: number
  }[]
  heading: string
  subheading: string
  paragraph: string
}
