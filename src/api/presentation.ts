import axiosClient from '@/utils/axiosClient';

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Option {
  value: string;
}

export interface Slide {
  _id: string;
  title: string;
  slideType: string;
  presentationId: string;
  userCreated: User;
  userUpdated: string;
  options: Option[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  answer: string;
}

export interface Presentation {
  name: string;
  description: string;
  collaborators: User[];
  slides: Slide[];
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
  slides: Slide[];
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
};

export default presentationApi;
