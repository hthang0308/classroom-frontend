import {
  Button,
  CopyButton, Group, Skeleton, Stack, Text,
} from '@mantine/core';
import React, {
  useEffect, useMemo, useState,
} from 'react';

import { io as socketIO, Socket } from 'socket.io-client';

import config from '../../../../config';

import { Option, PresentationWithUserCreated } from '@/api/presentation';
import MultiChoiceDisplaySlide from '@/pages/presentation/slides/MultiChoice';
import { MultiChoiceSlide } from '@/pages/presentation/types';
import {
  ClientToServerEvents,
  ClientToServerEventType,
  ServerToClientEvents,
  ServerToClientEventType, WaitInRoomNewVoteData, WaitInRoomType,
} from '@/socket/types';
import { SlideType } from '@/utils/constants';
import getJwtToken from '@/utils/getJwtToken';

interface HostPresentationProps {
  presentation: PresentationWithUserCreated;
}

export default function HostPresentation({ presentation }: HostPresentationProps) {
  const [roomId, setRoomId] = useState<string>('');
  const { jwtToken } = getJwtToken();

  const multiChoiceSlide = presentation.slides.find((s) => s.slideType === SlideType.MultipleChoice);
  const [options, setOptions] = useState<Option[]>(multiChoiceSlide?.options || []);

  const displaySlideData = useMemo<MultiChoiceSlide | undefined>(() => multiChoiceSlide && {
    type: SlideType.MultipleChoice,
    title: multiChoiceSlide.title,
    options,
    time: 30,
  }, [multiChoiceSlide, options]);
  const invitationLink = `${config.backendUrl}/presentation/join`;

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
          case WaitInRoomType.newSlide: {
            // will do later
            break;
          }

          case WaitInRoomType.newVote: {
            if (displaySlideData) {
              setOptions((data as WaitInRoomNewVoteData).data);
            }

            break;
          }

          case WaitInRoomType.info: {
            break;
          }

          default: {
            break;
          }
        }
      });

      socket.emit(ClientToServerEventType.hostCreateRoom, { presentationId: presentation._id.toString() });
    });

    return () => {
      socket.disconnect();
    };
  }, [displaySlideData, presentation._id, socket]);

  return (
    <Skeleton visible={!isLoading}>
      <Stack>
        <Group position="center">
          <Text>
            Copy the code
          </Text>
          <CopyButton value={roomId}>
            {({ copied, copy }) => (
              <Button size="xs" color={copied ? 'teal' : 'blue'} onClick={copy}>
                {roomId}
              </Button>
            )}
          </CopyButton>
          <Text>
            or the link
          </Text>
          <CopyButton value={invitationLink}>
            {({ copied, copy }) => (
              <Button size="xs" color={copied ? 'teal' : 'blue'} onClick={copy}>
                {invitationLink}
              </Button>
            )}
          </CopyButton>

        </Group>
        {
          displaySlideData === undefined ? (
            <div>NoSide</div>
          ) : (
            <MultiChoiceDisplaySlide {...displaySlideData} />
          )
        }
      </Stack>
    </Skeleton>
  );
}

