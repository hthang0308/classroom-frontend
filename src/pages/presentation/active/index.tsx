import { Container } from '@mantine/core';
import { SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { useParams } from 'react-router-dom';
import { io as socketIO, Socket } from 'socket.io-client';

import presentationApi, { PresentationWithUserCreated } from '@/api/presentation';
import userApi, { User } from '@/api/user';
import * as notificationManager from '@/pages/common/notificationManager';
import HeadingDisplaySlide from '@/pages/presentation/slides/Heading';
import MultiChoiceDisplaySlide from '@/pages/presentation/slides/MultiChoice';
import { Slide } from '@/pages/presentation/types';
import {
  ClientToServerEvents,
  ClientToServerEventType,
  ServerToClientEvents,
  ServerToClientEventType,
} from '@/socket/types';
import { ErrorResponse, isAxiosError } from '@/utils/axiosErrorHandler';
import { SlideType } from '@/utils/constants';

const MOCK_SLIDES: Slide[] = [
  {
    type: SlideType.Heading,
    title: 'This is a title 1',
    subTitle: 'this is a sub title',
    background: 'red',
  },
  {
    type: SlideType.Heading,
    title: 'This is a title 2',
    subTitle: 'this is a sub title',
    background: 'https://images.unsplash.com/photo-1533282960533-51328aa49826?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2142&q=80',
  },
  {
    type: SlideType.Heading,
    title: 'This is a title 3',
    subTitle: 'this is a sub title',
  },
  {
    type: SlideType.MultipleChoice,
    title: 'This is a title',
    time: 30,
    options: [
      {
        value: 'option-a',
        color: 'red',
      },
      {
        value: 'option-b',
        color: 'blue',
      },
      {
        value: 'option-c',
        color: 'green',
      },
    ],
  },
  {
    type: SlideType.Heading,
    title: 'This is a title 4',
    subTitle: 'this is a sub title 4',
  },
];

//

function chooseSlide(slide: Slide) {
  switch (slide.type) {
    case SlideType.Heading: {
      return (
        <SplideSlide key={`heading_${slide.title}__${slide.subTitle}`}>
          <HeadingDisplaySlide {...slide} />
        </SplideSlide>
      );
    }

    case SlideType.MultipleChoice: {
      return (
        <SplideSlide key={`multi-choice_${slide.options.length}__${slide.time}`}>
          <MultiChoiceDisplaySlide {...slide} />
        </SplideSlide>
      );
    }

    default: {
      return <div>Wrong type</div>;
    }
  }
}

const useUser = () => {
  const [user, setUser] = useState<User>();
  const fetchData = async () => {
    try {
      const { data: response } = await userApi.getMe();

      setUser(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { user };
};

const usePresentation = (presentationId: string) => {
  const [presentation, setPresentation] = useState<PresentationWithUserCreated>();
  const fetchData = useCallback(async () => {
    if (!presentationId) {
      return;
    }

    try {
      const { data: response } = await presentationApi.getPresentationById(presentationId);

      setPresentation(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, [presentationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { presentation };
};

const wsURL = 'http://localhost:3000';

interface HostPresentationProps {
  user: User;
  presentation: PresentationWithUserCreated;
}

function HostPresentation({ presentation, user }: HostPresentationProps) {
  const [roomId, setRoomId] = useState<string>();
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useMemo(() => socketIO(wsURL), []);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('send host create room');
      socket.emit(ClientToServerEventType.hostCreateRoom, { presentationId: presentation._id });
      socket.emit(ClientToServerEventType.joinRoom, { roomId: '223123' });

      // @ts-ignore
      socket.emit('host-create-room', { presentationId: '12312' });

      socket.on(ServerToClientEventType.waitHostCreateRoom, (data) => {
        console.log(data);
        setRoomId(data.roomId);
      });
    });
  });

  return (
    <div>
      Host
      {roomId}
    </div>
  );
}

export default function ActivePresentation() {
  const { presentationId = '' } = useParams<string>();
  const { user } = useUser();
  const { presentation } = usePresentation(presentationId);
  const isHost = (user?._id || 'unknown') === presentation?.userCreated._id;

  return (
    <Container fluid sx={{ height: '100%' }}>
      {/* <Splide style={{ height: 600 }} options={{ type: 'fade' }}> */}
      {/*   { */}
      {/*     MOCK_SLIDES.map((element) => chooseSlide(element)) */}
      {/*   } */}
      {/* </Splide> */}
      {/* <div>Test</div> */}
      {
        isHost ? (
          <HostPresentation user={user as User} presentation={presentation as PresentationWithUserCreated} />
        ) : (
          <div>is guest</div>
        )
      }
    </Container>
  );
}
