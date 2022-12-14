export enum ClientToServerEventType {
  hostCreateRoom = 'host-create-room',
  joinRoom = 'join-room',
  // hostStartSlide = 'host-start-slide',
  // hostStopPresentation = 'host-stop-presentation',
  // leaveRoom = 'leave-room',
  // memberVote = 'member-vote',
  //
  // privateMessage = 'private-message',
  //
}

export enum ServerToClientEventType {
  waitHostCreateRoom = 'wait-host-create-room',
  joinRoom = 'join-room',
  waitInRoom = 'wait-in-room',

  // privateMessage = 'private-message',
}

export interface HostCreateRoomData {
  presentationId: string;
}

export interface BasicServerData {
  roomId: string;
  message: string;
}

export interface JoinRoomData {
  roomId: string;
}

export interface ClientToServerEvents {
  [ClientToServerEventType.hostCreateRoom]: (data: HostCreateRoomData) => void;
  [ClientToServerEventType.joinRoom]: (data: JoinRoomData) => void;
}

export interface ServerToClientEvents {
  [ServerToClientEventType.waitHostCreateRoom]: (data: BasicServerData) => void;
  [ServerToClientEventType.waitInRoom]: (data: BasicServerData) => void;
}

