import {
  CompactSlide, MultiChoiceOption, PresentationWithUserInfo,
} from '@/api/presentation';
import { Chat } from '@/pages/presentation/slides/types';

export const ClientToServerEventType = {
  hostCreateRoom: 'host-create-room',
  joinRoom: 'join-room',
  leaveRoom: 'leave-room',
  hostStartSlide: 'host-start-slide',
  hostStopPresentation: 'host-stop-presentation',
  memberVote: 'member-vote',
  memberChat: 'member-chat',
} as const;

export const ServerToClientEventType = {
  waitHostCreateRoom: 'wait-host-create-room',
  waitJoinRoom: 'wait-join-room',
  waitInRoom: 'wait-in-room',
  privateMessage: 'private-message',
} as const;

export const WaitInRoomType = {
  info: 'info',
  newSlide: 'new-slide',
  newVote: 'new-vote',
  newChat: 'new-chat',
  stopPresentation: 'stop-presentation',
} as const;

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

export interface MemberChatData {
  message: string;
}

export interface WaitHostCreateRoomData {
  roomId: string;
  message: string;
}

export interface WaitJoinRoomData {
  message: string;
  data: PresentationWithUserInfo;
}

export interface WaitInRoomNewVoteData {
  type: typeof WaitInRoomType.newVote;
  message: string;
  data: Required<MultiChoiceOption>[]
}

export interface WaitInRoomNewChatData {
  type: typeof WaitInRoomType.newChat;
  message: string;
  data: Chat;
}

export interface WaitInRoomInfoData {
  type: typeof WaitInRoomType.info;
  message: string;
}

export interface WaitInRoomNewSlideData {
  type: typeof WaitInRoomType.newSlide;
  message: string;
  data: CompactSlide;
}

export interface WaitInRoomStopPresentation {
  type: typeof WaitInRoomType.stopPresentation;
}

export type WaitInRoomData = WaitInRoomInfoData | WaitInRoomNewVoteData
| WaitInRoomNewSlideData | WaitInRoomStopPresentation | WaitInRoomNewChatData;

export interface ClientToServerEvents {
  [ClientToServerEventType.hostCreateRoom]: (data: HostStartStopRoomData) => void;
  [ClientToServerEventType.hostStopPresentation]: (data: HostStartStopRoomData) => void;
  [ClientToServerEventType.joinRoom]: (data: JoinLeaveRoomData) => void;
  [ClientToServerEventType.leaveRoom]: (data: JoinLeaveRoomData) => void;
  [ClientToServerEventType.hostStartSlide]: (data: HostStartSlideData) => void;
  [ClientToServerEventType.memberVote]: (data: MemberVoteData) => void;
  [ClientToServerEventType.memberChat]: (data: MemberChatData) => void;
}

export interface ServerToClientEvents {
  [ServerToClientEventType.waitHostCreateRoom]: (data: WaitHostCreateRoomData) => void;
  [ServerToClientEventType.waitJoinRoom]: (data: WaitJoinRoomData) => void;
  [ServerToClientEventType.waitInRoom]: (data: WaitInRoomData) => void;
}

