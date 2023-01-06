import {
  Alert,
  Button, Group, Stack, TextInput,
} from '@mantine/core';
import config from 'config';
import React, { useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { io as socketIO, Socket } from 'socket.io-client';

import presentationApi, { CompactSlide, PresentationWithUserInfo, MultiChoiceOption } from '@/api/presentation';

import MultiChoiceDisplaySlide from '@/pages/presentation/slides/guest/multiChoice';
import {
  ClientToServerEvents,
  ClientToServerEventType,
  ServerToClientEvents,
  ServerToClientEventType, WaitInRoomType,
} from '@/socket/types';
import { SlideTypes } from '@/utils/constants';

import getJwtToken from '@/utils/getJwtToken';

interface InputCodePageProps {
  initialRoomId?: string | null;
  setRoomId: (_: string) => void;
}
function InputCodePage({ setRoomId, initialRoomId = '' }: InputCodePageProps) {
  const [input, setInput] = useState<string>(initialRoomId || '');
  const [err, setErr] = useState('');

  const checkRoomId = async (value: string) => {
    try {
      await presentationApi.getSocketRoom(value);
      setErr('');
      setRoomId(value);
    } catch {
      setErr(`You cannot access room with id '${value}'`);
    }
  };

  useEffect(() => {
    if (!initialRoomId) {
      return;
    }

    checkRoomId(initialRoomId);
  });

  // noinspection RequiredAttributes
  return (
    <Stack align="center">
      <Group position="center">
        <TextInput placeholder="Enter room id here" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
        <Button onClick={() => checkRoomId(input)}>Join</Button>
      </Group>
      {
        err && (
          // eslint-disable-next-line
          <Alert title={err} color="red" variant="filled" sx={{ width: 'fit-content'}}>
          </Alert>
        )
      }
    </Stack>
  );
}

interface SlideSwitcherProps {
  slide?: CompactSlide;
  options: MultiChoiceOption[];
  sendVote: (_: MultiChoiceOption) => void;
}

function SlideSwitcher({ slide, options, sendVote }: SlideSwitcherProps) {
  let Slide: React.ReactNode;

  switch (slide?.slideType) {
    case SlideTypes.multipleChoice: {
      Slide = <MultiChoiceDisplaySlide title={slide?.title} options={options} sendVote={sendVote} />;
      break;
    }

    default: {
      Slide = (
        <div>
          No slide or wrong type
          {' '}
          {slide?.slideType}
          {' '}
          {slide?._id}
        </div>
      );
      break;
    }
  }

  return Slide;
}

export interface ShowPageProps {
  roomId: string;
}

function ShowPage({ roomId }: ShowPageProps) {
  const { jwtToken } = getJwtToken();

  const [, setPresentation] = useState<PresentationWithUserInfo>();
  const [currentSlide, setCurrentSlide] = useState<CompactSlide>();
  const [options, setOptions] = useState<MultiChoiceOption[]>([]);

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const navigate = useNavigate();

  const sendVote = (option: MultiChoiceOption) => {
    if (!socket) {
      return;
    }

    socket.emit(ClientToServerEventType.memberVote, {
      slideId: currentSlide?._id || '',
      optionIndex: option.index === undefined ? -1 : option.index,
    });
  };

  useEffect(() => {
    if (!socket) {
      setSocket((prevState) => {
        if (prevState) {
          return prevState;
        }

        return socketIO(config.backendUrl, { extraHeaders: { Authorization: `Bearer ${jwtToken}` } });
      });
      return () => { };
    }

    socket.on('connect', () => {
      socket.on(ServerToClientEventType.waitJoinRoom, (data) => {
        setPresentation(data.data);
      });

      socket.on(ServerToClientEventType.waitInRoom, (data) => {
        switch (data.type) {
          case WaitInRoomType.newSlide: {
            setCurrentSlide(data.data);
            setOptions(data.data.options);
            break;
          }

          case WaitInRoomType.stopPresentation: {
            navigate('/presentations');
            break;
          }

          default: {
            break;
          }
        }
      });

      socket.emit(ClientToServerEventType.joinRoom, { roomId });
    });

    return () => {
      socket.emit(ClientToServerEventType.leaveRoom, { roomId });
      socket.disconnect();
    };
  }, [jwtToken, navigate, roomId, socket]);

  return (
    <div>
      <SlideSwitcher options={options} sendVote={sendVote} slide={currentSlide} />
    </div>
  );
}

export default function GuestPresentation() {
  const [searchParams] = useSearchParams();
  const paramRoomId = searchParams.get('roomId');
  const [roomId, setRoomId] = useState('');

  return (
    roomId ? (
      <ShowPage roomId={roomId} />
    ) : (
      <InputCodePage setRoomId={setRoomId} initialRoomId={paramRoomId} />
    )
  );
}
