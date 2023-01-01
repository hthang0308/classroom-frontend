import {
  Button,
  Container, Group, Skeleton, Stack, Text, Title,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconPresentationOff } from '@tabler/icons';
import config from 'config';
import {
  useEffect, useMemo, useState,
} from 'react';

import { useParams, useNavigate } from 'react-router-dom';
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
import { SlideTypes } from '@/utils/constants';
import getJwtToken from '@/utils/getJwtToken';

interface NavigationHeaderProps {
  roomId: string;
  invitationLink: string;
  presentationData: PresentationWithUserInfo | undefined
}

function NavigationHeader({ roomId, invitationLink, presentationData }: NavigationHeaderProps) {
  const navigate = useNavigate();

  return (
    <Stack>
      <Group position="center">
        <Text>Copy the code</Text>
        <CopyButton value={roomId} />
        <Text>or the link</Text>
        <CopyButton value={invitationLink} />
      </Group>
      <Group position="apart">
        <Group>
          <Button><IconArrowLeft /></Button>
          <Button><IconArrowRight /></Button>
        </Group>
        <Group>
          <FullScreenButton />
          <Button
            color="red"
            onClick={() => navigate(`/presentation/${presentationData?._id}/${presentationData?.slides[0]._id}/edit`)}
            leftIcon={<IconPresentationOff />}
          >
            <Text>Stop present</Text>
          </Button>
        </Group>
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

  const multiChoiceSlide = presentation.slides.find((s) => s.slideType === SlideTypes.multipleChoice);
  const [options, setOptions] = useState<MultiChoiceOption[]>(multiChoiceSlide?.options || []);

  const displaySlideData = useMemo(() => multiChoiceSlide, [multiChoiceSlide]);
  const invitationLink = `${window.location.host}/presentation/join`;

  const isLoading = multiChoiceSlide === undefined || !!roomId;

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

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
  }, [displaySlideData, jwtToken, presentation._id, socket]);

  return (
    <Skeleton visible={!isLoading}>
      <Stack>
        <NavigationHeader roomId={roomId} invitationLink={invitationLink} presentationData={presentation} />
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
  const { user, isLoading } = useUser();
  const { presentation } = usePresentation(presentationId);
  const isHost = (user?._id || 'unknown') === presentation?.userCreated._id;

  return (
    <Container fluid>
      <Skeleton visible={isLoading}>
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
