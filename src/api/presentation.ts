import {
  BasicObject, CompactUser, BaseResponse,
} from '@/api/types';
import axiosClient from '@/utils/axiosClient';
import { SlideType } from '@/utils/constants';

export interface MultiChoiceOption {
  value: string;
  quantity?: number
  index?: number
  color?: string;
}

export interface MultipleChoiceDataType {
  question: string
  options: MultiChoiceOption[]
}

export interface CompactMultiChoiceSlide {
  _id: string;
  title: string;
  slideType: SlideType.MultipleChoice;
  options: MultiChoiceOption[];
  answer: string[];
}

export interface MultiChoiceSlide extends CompactMultiChoiceSlide, BasicObject {
  presentationId: string;
  userCreated: string;
  userUpdated: string;
}

interface BasePresentation<UserType> extends BasicObject {

  name: string;
  description: string;
  collaborators: CompactUser[];
  slides: CompactMultiChoiceSlide[];
  userCreated: UserType;
}

export type Presentation = BasePresentation<string>;

export type PresentationWithUserInfo = BasePresentation<CompactUser>;

const presentationApi = {
  createPresentation: (name: string) => (
    axiosClient.post<BaseResponse<Presentation>>('/presentation', { name })
  ),
  getMyPresentations: () => (
    axiosClient.get<BaseResponse<PresentationWithUserInfo[]>>('/presentation/my-presentation')
  ),
  getPresentationById: (id?: string) => (
    axiosClient.get<BaseResponse<PresentationWithUserInfo>>(`/presentation/${id}`)
  ),
  deletePresentation: (id?: string) => (
    axiosClient.delete<BaseResponse<null>>(`/presentation/${id}`)
  ),
  updateMultipleChoiceSlide: (id: string | undefined, data: MultipleChoiceDataType) => (
    axiosClient.put<BaseResponse<MultiChoiceSlide>>(`/slide/${id}`, {
      title: data.question,
      options: data.options,
    })
  ),
  createSlide: (presentationId?: string) => (
    axiosClient.post<BaseResponse<MultiChoiceSlide>>('/slide', { presentationId })
  ),
  deleteSlide: (id?: string) => (
    axiosClient.delete<BaseResponse<null>>(`/slide/${id}`)
  ),
};

export default presentationApi;
