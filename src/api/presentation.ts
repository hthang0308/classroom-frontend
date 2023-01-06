import {
  BasicObject, CompactUser, BaseResponse, BasicResponse,
} from '@/api/types';
import axiosClient from '@/utils/axiosClient';
import { SlideTypes, SlideTypesType } from '@/utils/constants';

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

export interface HeadingParagraphDataType {
  title: string
  content: string
  type: string
}

export interface CompactMultiChoiceSlide {
  _id: string;
  title: string;
  slideType: SlideTypesType;
  options: MultiChoiceOption[];
}

export interface CompactHeadingParagraphSlide {
  _id: string;
  title: string;
  content?: string;
  slideType: SlideTypesType;
}

interface ExtraProps {
  presentationId: string;
  userCreated: string;
  userUpdated: string;
}

export interface MultiChoiceSlide extends CompactMultiChoiceSlide, BasicObject, ExtraProps { }

export interface HeadingParagraphSlide extends CompactHeadingParagraphSlide, BasicObject, ExtraProps { }

export interface CompactSlide extends CompactMultiChoiceSlide, CompactHeadingParagraphSlide { }

export interface Slide extends MultiChoiceSlide, HeadingParagraphSlide { }

interface BasePresentation<UserType> extends BasicObject {
  name: string;
  description: string;
  collaborators: CompactUser[];
  slides: CompactSlide[];
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
      slideType: SlideTypes.multipleChoice,
      title: data.question,
      options: data.options,
    })
  ),
  updateHeadingParagraphSlide: (id: string | undefined, data: HeadingParagraphDataType) => (
    axiosClient.put<BaseResponse<HeadingParagraphSlide>>(`/slide/${id}`, {
      title: data.title,
      content: data.content,
      slideType: data.type,
    })
  ),
  createSlide: (presentationId?: string) => (
    axiosClient.post<BaseResponse<Slide>>('/slide', {
      presentationId,
      slideType: SlideTypes.multipleChoice,
    })
  ),
  deleteSlide: (id?: string) => (
    axiosClient.delete<BaseResponse<null>>(`/slide/${id}`)
  ),

  getSocketRoom: (roomId: string) => (
    axiosClient.get<BasicResponse>(`/presentation/get-socket-room/${roomId}`)
  ),
};

export default presentationApi;
