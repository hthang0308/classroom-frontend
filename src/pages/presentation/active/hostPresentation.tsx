import {
  Button,
  Container, Group, Skeleton, Stack, Text, Title,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons';
import config from 'config';
import React, {
  useEffect, useMemo, useState,
} from 'react';

import { useParams } from 'react-router-dom';
import { io as socketIO, Socket } from 'socket.io-client';

import { MultiChoiceOption, PresentationWithUserInfo } from '@/api/presentation';
import CopyButton from '@/pages/common/buttons/copyButton';
import FullScreenButton from '@/pages/common/buttons/fullScreenButton';
import { usePresentation, useUser } from '@/pages/presentation/hooks';
import MultiChoiceDisplaySlide from '@/pages/presentation/slides/multiChoice';
import {
  ClientToServerEvents,
  ClientToServerEventType,
  ServerToClientEvents,
  ServerToClientEventType,
  WaitInRoomNewVoteData,
  WaitInRoomType,
} from '@/socket/types';
import { SlideType } from '@/utils/constants';
import getJwtToken from '@/utils/getJwtToken';

interface NavigationHeaderProps {
  roomId: string;
  invitationLink: string;
}

function NavigationHeader({ roomId, invitationLink }: NavigationHeaderProps) {
  return (
    <Stack>
      <Group position="center">
        <Text>
          Copy the code
        </Text>
        <CopyButton value={roomId} />
        <Text>
          or the link
        </Text>
        <CopyButton value={invitationLink} />
      </Group>
      <Group position="apart">
        <Group>
          <Button>
            <IconArrowLeft />
          </Button>
          <Button>
            <IconArrowRight />
          </Button>
        </Group>
        <FullScreenButton />
      </Group>
    </Stack>
  );
}

interface HostPresentationProps {
  presentation: PresentationWithUserInfo;
}

function ShowPage({ presentation }: HostPresentationProps) {
  const [roomId, setRoomId] = useState<string>('');
  const { jwtToken } = getJwtToken();

  const multiChoiceSlide = presentation.slides.find((s) => s.slideType === SlideType.multipleChoice);
  const [options, setOptions] = useState<MultiChoiceOption[]>(multiChoiceSlide?.options || []);

  const displaySlideData = useMemo(() => multiChoiceSlide, [multiChoiceSlide]);
  const invitationLink = `${window.location.host}/presentation/join`;

  const isLoading = multiChoiceSlide === undefined || !!roomId;

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(
    () => socketIO(config.backendUrl, { extraHeaders: { Authorization: `Bearer ${jwtToken}` } }),
    [jwtToken],
  );

  useEffect(() => {
    socket.on('connect', () => {
      socket.on(ServerToClientEventType.waitHostCreateRoom, (data) => {
        setRoomId(data.roomId);
      });

      socket.on(ServerToClientEventType.waitInRoom, (data) => {
        switch (data.type) {
          case WaitInRoomType.newVote: {
            if (displaySlideData) {
              setOptions((data as WaitInRoomNewVoteData).data);
            }

            break;
          }

          default: {
            break;
          }
        }
      });

      socket.emit(ClientToServerEventType.hostCreateRoom, { presentationId: presentation._id });
    });

    return () => {
      socket.emit(ClientToServerEventType.hostStopPresentation, { presentationId: presentation._id });
      socket.disconnect();
    };
  }, [displaySlideData, presentation._id, socket]);

  return (
    <Skeleton visible={!isLoading}>
      <Stack>
        <NavigationHeader roomId={roomId} invitationLink={invitationLink} />
        {
          displaySlideData === undefined ? (
            <div>No Slide</div>
          ) : (
            <div style={{ padding: 20 }}>
              <MultiChoiceDisplaySlide title={multiChoiceSlide?.title} options={options} />
            </div>
          )
        }
      </Stack>
    </Skeleton>
  );
}

export default function HostPresentation() {
  const { presentationId = '' } = useParams<string>();
  const { user } = useUser();
  const { presentation } = usePresentation(presentationId);
  const isHost = (user?._id || 'unknown') === presentation?.userCreated._id;

  return (
    <Container fluid sx={{ height: '100%' }}>
      <Skeleton visible={user === undefined}>
        {
          isHost ? (
            <ShowPage presentation={presentation as PresentationWithUserInfo} />
          ) : (
            <Title order={3} sx={{ textAlign: 'center' }}>You cannot start a presentation that is not yours</Title>
          )
        }
      </Skeleton>
    </Container>
  );
}
