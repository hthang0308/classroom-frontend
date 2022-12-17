import {
  Button, Group, SimpleGrid, TextInput, Title, Text,
} from '@mantine/core';
import config from 'config';
import React, { useEffect, useState } from 'react';

import { io as socketIO, Socket } from 'socket.io-client';

import { PresentationWithUserInfo, MultiChoiceOption } from '@/api/presentation';

import {
  ClientToServerEvents,
  ClientToServerEventType,
  ServerToClientEvents,
  ServerToClientEventType,
} from '@/socket/types';
import { SlideType } from '@/utils/constants';

import getJwtToken from '@/utils/getJwtToken';

export interface ShowPageProps {
  roomId: string;
}

function InputCodePage({ setRoomId }: { setRoomId: (_: string) => void }) {
  const [input, setInput] = useState('');

  return (
    <Group position="center">
      <TextInput placeholder="Enter room id here" value={input} onChange={(e) => setInput(e.currentTarget.value)} />
      <Button onClick={() => setRoomId(input)}>Join</Button>
    </Group>
  );
}

function ShowPage({ roomId }: ShowPageProps) {
  const { jwtToken } = getJwtToken();

  const [presentation, setPresentation] = useState<PresentationWithUserInfo>();
  const [voteValue, setVoteValue] = useState<MultiChoiceOption>();

  const multiChoiceSlide = (presentation?.slides || []).find((s) => s.slideType === SlideType.multipleChoice);
  const options = multiChoiceSlide?.options || [];

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const sendVote = (option: MultiChoiceOption) => {
    if (!socket) {
      return;
    }

    setVoteValue(option);
    socket.emit(ClientToServerEventType.memberVote, {
      slideId: multiChoiceSlide?._id || '',
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
      return () => {};
    }

    socket.on('connect', () => {
      socket.on(ServerToClientEventType.waitJoinRoom, (data) => {
        setPresentation(data.data);
      });

      socket.emit(ClientToServerEventType.joinRoom, { roomId });
    });

    return () => {
      socket.emit(ClientToServerEventType.leaveRoom, { roomId });
      socket.disconnect();
    };
  }, [jwtToken, roomId, socket]);

  return (
    <div>
      <Title order={3} sx={{ textAlign: 'center' }}>{multiChoiceSlide?.title}</Title>
      {
        voteValue ? (
          <Text sx={{ textAlign: 'center' }}>
            You voted for
            {' '}
            {voteValue.value}
          </Text>
        ) : (
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              {
                maxWidth: 980, cols: 3, spacing: 'md',
              },
              {
                maxWidth: 755, cols: 2, spacing: 'sm',
              },
              {
                maxWidth: 600, cols: 1, spacing: 'sm',
              },
            ]}
          >
            {
              options.map((o) => (
                <Button
                  key={`${o.index}__${o.value}`}
                  onClick={() => sendVote(o)}
                >
                  {o.value}
                </Button>
              ))
            }
          </SimpleGrid>
        )
      }
    </div>
  );
}

export default function GuestPresentation() {
  const [roomId, setRoomId] = useState('');

  return (
    roomId ? (
      <ShowPage roomId={roomId} />
    ) : (
      <InputCodePage setRoomId={setRoomId} />
    )
  );
}
