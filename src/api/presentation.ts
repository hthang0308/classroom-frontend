import axiosClient from '@/utils/axiosClient';

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Option {
  value: string;
  quantity?: number
}

export interface MultipleChoiceDataType {
  question: string
  options: Option[]
}

export interface Slide {
  _id: string;
  title: string;
  slideType: string;
  answer: string[];
  presentationId: string;
  userCreated: User;
  userUpdated: string;
  options: Option[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface CompactSlide {
  _id: string;
  title: string;
  slideType: string;
  options: Option[];
  answer: string[];
}

export interface Presentation {
  name: string;
  description: string;
  collaborators: User[];
  slides: CompactSlide[];
  userCreated: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface PresentationWithUserCreated {
  name: string;
  description: string;
  collaborators: User[];
  slides: CompactSlide[];
  userCreated: User;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface ResponseType<T> {
  statusCode: number
  data: T
  message: string
}

const presentationApi = {
  createPresentation: (name: string) => (
    axiosClient.post<ResponseType<Presentation>>('/presentation', { name })
  ),
  getMyPresentations: () => (
    axiosClient.get<ResponseType<PresentationWithUserCreated[]>>('/presentation/my-presentation')
  ),
  getPresentationById: (id: string | undefined) => (
    axiosClient.get<ResponseType<PresentationWithUserCreated>>(`/presentation/${id}`)
  ),
  deletePresentation: (id: string | undefined) => (
    axiosClient.delete<ResponseType<null>>(`/presentation/${id}`)
  ),
  updateMultipleChoiceSlide: (id: string | undefined, data: MultipleChoiceDataType) => (
    axiosClient.put<ResponseType<Slide>>(`/slide/${id}`, {
      title: data.question,
      options: data.options,
    })
  ),
};

export default presentationApi;
