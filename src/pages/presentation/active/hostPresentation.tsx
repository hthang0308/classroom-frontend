import {
  Button,
  Container, Group, Skeleton, Stack, Text, Title,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconPresentationOff } from '@tabler/icons';
import config from 'config';
import React, {
  useEffect, useState,
} from 'react';

import { useParams, useNavigate } from 'react-router-dom';
import { io as socketIO, Socket } from 'socket.io-client';

import { CompactSlide, MultiChoiceOption, PresentationWithUserInfo } from '@/api/presentation';
import CopyButton from '@/pages/common/buttons/copyButton';
import FullScreenButton from '@/pages/common/buttons/fullScreenButton';
import { usePresentation, useUser } from '@/pages/presentation/hooks';
import HeadingDisplaySlide from '@/pages/presentation/slides/host/heading';
import MultiChoiceDisplaySlide from '@/pages/presentation/slides/host/multiChoice';
import ParagraphDisplaySlide from '@/pages/presentation/slides/host/paragraph';
import {
  ClientToServerEvents,
  ClientToServerEventType,
  ServerToClientEvents,
  ServerToClientEventType,
  WaitInRoomType,
} from '@/socket/types';
import { SlideTypes } from '@/utils/constants';
import getJwtToken from '@/utils/getJwtToken';

interface NavigationHeaderProps {
  roomId: string;
  invitationLink: string;
  presentationData: PresentationWithUserInfo | undefined

  toNextSlide: () => void;
  toPrevSlide: () => void;
}

function NavigationHeader({
  roomId, invitationLink, presentationData, toNextSlide, toPrevSlide,
}: NavigationHeaderProps) {
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
          <Button onClick={() => { toPrevSlide(); }}><IconArrowLeft /></Button>
          <Button onClick={() => { toNextSlide(); }}><IconArrowRight /></Button>
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

interface SlideSwitcherProps {
  slide?: CompactSlide;
  options: MultiChoiceOption[];
}

function SlideSwitcher({ slide, options }: SlideSwitcherProps) {
  let Slide: React.ReactNode;

  switch (slide?.slideType) {
    case SlideTypes.multipleChoice: {
      Slide = <MultiChoiceDisplaySlide title={slide?.title} options={options} />;
      break;
    }

    case SlideTypes.heading: {
      Slide = <HeadingDisplaySlide heading={slide.title} subHeading={slide.content} />;
      break;
    }

    case SlideTypes.paragraph: {
      Slide = <ParagraphDisplaySlide heading={slide.title} paragraph={slide.content} />;
      break;
    }

    default: {
      Slide = (
        <div>
          No slide or wrong type
          {slide?.slideType}
        </div>
      );
      break;
    }
  }

  return Slide;
}

interface HostPresentationProps {
  presentation: PresentationWithUserInfo;
}

function ShowPage({ presentation }: HostPresentationProps) {
  const [roomId, setRoomId] = useState<string>('');
  const { jwtToken } = getJwtToken();

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const handleChangeSlide = (index: number) => {
    if (index === currentSlideIndex) {
      return;
    }

    socket?.emit(ClientToServerEventType.hostStartSlide, { slideId: presentation.slides[index]._id });
    setCurrentSlideIndex(index);
  };

  const toNextSlide = () => {
    handleChangeSlide(Math.min(presentation.slides.length, currentSlideIndex + 1));
  };

  const toPrevSlide = () => {
    handleChangeSlide(Math.max(0, currentSlideIndex - 1));
  };

  const currentSlide = presentation.slides[currentSlideIndex];
  const [options, setOptions] = useState<MultiChoiceOption[]>(currentSlide?.options || []);

  const invitationLink = `${window.location.host}/presentation/join/${roomId}`;

  const isLoading = currentSlide === undefined || !!roomId;

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
            setOptions(data.data);

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
  }, [jwtToken, presentation._id, socket]);

  return (
    <Skeleton visible={!isLoading}>
      <Stack>
        <NavigationHeader
          roomId={roomId}
          invitationLink={invitationLink}
          presentationData={presentation}
          toNextSlide={toNextSlide}
          toPrevSlide={toPrevSlide}
        />
        <div style={{ padding: 20 }}>
          <SlideSwitcher options={options} slide={currentSlide} />
        </div>
      </Stack>
    </Skeleton>
  );
}

export default function HostPresentation() {
  const { presentationId = '' } = useParams<string>();
  const { user, isLoading } = useUser();
  const { presentation } = usePresentation(presentationId);
  const isHost = (user?._id || 'unknown') === presentation?.userCreated._id;
  const hasSlide = !!presentation?.slides?.length;

  return (
    <Container fluid>
      <Skeleton visible={isLoading}>
        {
          // eslint-disable-next-line no-nested-ternary
          isHost ? (
            <ShowPage presentation={presentation as PresentationWithUserInfo} />
          ) : (
            hasSlide ? (
              <Title order={3} sx={{ textAlign: 'center' }}>You cannot start a presentation that is not yours</Title>
            ) : (
              <Title order={3} sx={{ textAlign: 'center' }}>You have no slide</Title>
            )
          )
        }
      </Skeleton>
    </Container>
  );
}
