import {
  CompactMultiChoiceSlide, MultiChoiceOption, PresentationWithUserInfo,
} from '@/api/presentation';

export enum ClientToServerEventType {
  hostCreateRoom = 'host-create-room',
  joinRoom = 'join-room',
  leaveRoom = 'leave-room',
  hostStartSlide = 'host-start-slide',
  hostStopPresentation = 'host-stop-presentation',
  memberVote = 'member-vote',
}

export enum ServerToClientEventType {
  waitHostCreateRoom = 'wait-host-create-room',
  waitJoinRoom = 'wait-join-room',
  waitInRoom = 'wait-in-room',

  privateMessage = 'private-message',
}

export interface HostStartStopRoomData {
  presentationId: string;
}

export interface HostStartSlideData {
  slideId: string;
}

export interface JoinLeaveRoomData {
  roomId: string;
}

export interface MemberVoteData {
  slideId: string;
  optionIndex: number;
}

export interface WaitHostCreateRoomData {
  roomId: string;
  message: string;
}

export interface WaitJoinRoomData {
  message: string;
  data: PresentationWithUserInfo;
}

export enum WaitInRoomType {
  info = 'info',
  newSlide = 'new-slide',
  newVote = 'new-vote',
}

export interface WaitInRoomNewVoteData {
  type: WaitInRoomType.newVote;
  message: string;
  data: Required<MultiChoiceOption>[]
}

export interface WaitInRoomInfoData {
  type: WaitInRoomType.info;
  message: string;
}

export interface WaitInRoomNewSlideData {
  type: WaitInRoomType.newSlide;
  message: string;
  data: CompactMultiChoiceSlide;
}

export type WaitInRoomData = WaitInRoomInfoData | WaitInRoomNewVoteData | WaitInRoomNewSlideData;

export interface ClientToServerEvents {
  [ClientToServerEventType.hostCreateRoom]: (data: HostStartStopRoomData) => void;
  [ClientToServerEventType.hostStopPresentation]: (data: HostStartStopRoomData) => void;
  [ClientToServerEventType.joinRoom]: (data: JoinLeaveRoomData) => void;
  [ClientToServerEventType.leaveRoom]: (data: JoinLeaveRoomData) => void;
  [ClientToServerEventType.hostStartSlide]: (data: HostStartSlideData) => void;
  [ClientToServerEventType.memberVote]: (data: MemberVoteData) => void;
}

export interface ServerToClientEvents {
  [ServerToClientEventType.waitHostCreateRoom]: (data: WaitHostCreateRoomData) => void;
  [ServerToClientEventType.waitJoinRoom]: (data: WaitJoinRoomData) => void;
  [ServerToClientEventType.waitInRoom]: (data: WaitInRoomData) => void;
}

