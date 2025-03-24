import { Button, Container, Group, Skeleton, Stack, Text, Title, Grid, Modal } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconPresentationOff, IconList } from '@tabler/icons';
import config from 'config';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io as socketIO, Socket } from 'socket.io-client';

import ChatBox from './chatBox';
import { HostQuestionBox } from './questionBox';
import { Chat, Question, UserVote } from './types';

import presentationApi, { CompactSlide, MultiChoiceOption, PresentationWithUserInfo } from '@/api/presentation';
import CopyButton from '@/pages/common/buttons/copyButton';
import FullScreenButton from '@/pages/common/buttons/fullScreenButton';
import * as notificationManager from '@/pages/common/notificationManager';
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
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { SlideTypes } from '@/utils/constants';
import getJwtToken from '@/utils/getJwtToken';

interface NavigationHeaderProps {
  roomId: string;
  invitationLink: string;
  presentationData: PresentationWithUserInfo | undefined
  slideType: string
  userVotes: UserVote[]
  options: MultiChoiceOption[]

  toNextSlide: () => void;
  toPrevSlide: () => void;
}

function NavigationHeader({
  roomId, invitationLink, presentationData, toNextSlide, toPrevSlide, slideType, userVotes, options,
}: NavigationHeaderProps) {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  const handleOpenModal = () => {
    setOpened(true);
  };

  const handleCloseModal = () => {
    setOpened(false);
  };

  return (
    <>
      {
        slideType === SlideTypes.multipleChoice
          ? (
            <Modal
              title="Multiple choice result list"
              opened={opened}
              onClose={handleCloseModal}
              size="50%"
            >
              <DataTable
                columns={[
                  {
                    accessor: 'index',
                    title: '#',
                    textAlignment: 'center',
                    render: (_, index) => index + 1,
                  },
                  {
                    accessor: 'user.name',
                    title: 'Name',
                  },
                  {
                    accessor: 'user.email',
                    title: 'Email',
                  },
                  {
                    accessor: 'optionIndex',
                    title: 'Choice',
                    textAlignment: 'center',
                    render: (record: UserVote) => (
                      <Text>{(options.find((i) => i?.index === record.optionIndex))?.value || ''}</Text>
                    ),
                  },
                  {
                    accessor: 'createdAt',
                    title: 'Time vote',
                    textAlignment: 'center',
                    render: (record: UserVote) => (
                      <Text>{(new Date(record.createdAt)).toLocaleString('en-US')}</Text>
                    ),
                  },
                ]}
                records={userVotes}
                idAccessor="user._id"
                noRecordsText="No result"
                minHeight={150}
              />
            </Modal>
          )
          : null
      }
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
            {
              slideType === SlideTypes.multipleChoice
                ? (
                  <Button leftIcon={<IconList />} onClick={handleOpenModal}>Result List</Button>
                )
                : null
            }
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
    </>
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
  groupId?: string;
}

function ShowPage({ presentation, groupId = '' }: HostPresentationProps) {
  const [roomId, setRoomId] = useState<string>('');
  const { jwtToken } = getJwtToken();

  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const [chatHistory, setChatHistory] = useState<Chat[]>([]);
  const [nextOffset, setNextOffset] = useState(-1);
  const [isLoadMore, setLoadMore] = useState(false);

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);

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

  const handleSendChatMessage = (message: string) => {
    if (socket) {
      socket.emit(ClientToServerEventType.memberChat, { message });
    }
  };

  const handleAnswerQuestion = (questionId: string) => {
    if (socket) {
      socket.emit(ClientToServerEventType.hostAnswerQuestion, { questionId });
    }
  };

  const loadOldChat = useCallback(async (offset: number) => {
    if (offset === -2) {
      return;
    }

    try {
      const { data: response } = await presentationApi.getAllChat(roomId, offset);

      setChatHistory((prevState) => ([...response.data, ...prevState]));
      if (response.meta.nextOffset !== undefined && response.meta.nextOffset >= 0) {
        setNextOffset(response.meta.nextOffset);
      } else {
        setNextOffset(-2);
      }
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, [roomId]);

  const currentSlide = presentation.slides[currentSlideIndex];
  const [options, setOptions] = useState<MultiChoiceOption[]>(currentSlide?.options || []);

  const invitationLink = `${window.location.host}/presentation/join?roomId=${roomId}`;

  const isLoading = currentSlide === undefined || !!roomId;

  const [userVotes, setUserVotes] = useState<UserVote[]>([]);

  const getMultiChoiceResultList = useCallback(async () => {
    if (!roomId || currentSlide.slideType !== SlideTypes.multipleChoice) {
      return;
    }

    try {
      const { data: response } = await presentationApi.getMultiChoiceResult(roomId);

      setUserVotes((response.data.find((i) => i._id === currentSlide._id)?.userVotes || []));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, [roomId, currentSlide._id, currentSlide.slideType]);

  const intervalId = useRef<number>();

  useEffect(() => {
    intervalId.current = window.setInterval(() => {
      getMultiChoiceResultList();
    }, 3000);

    return () => window.clearInterval(intervalId.current);
  }, [getMultiChoiceResultList]);

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
            currentSlide.options = data.data;
            break;
          }

          case WaitInRoomType.newSlide: {
            setOptions(data.data.options);
            break;
          }

          case WaitInRoomType.newChat: {
            setChatHistory((prevState) => ([...prevState, data.data]));
            break;
          }

          case WaitInRoomType.newQuestion: {
            setAllQuestions((prevState) => ([...prevState, data.data]));
            break;
          }

          case WaitInRoomType.answerQuestion: {
            setAllQuestions(
              (prevState) => prevState.map((i) => (i.questionId === data.data.questionId ? data.data : i)),
            );
            break;
          }

          case WaitInRoomType.upvoteQuestion: {
            setAllQuestions(
              (prevState) => prevState.map((i) => (i.questionId === data.data.questionId ? data.data : i)),
            );
            break;
          }

          default: {
            break;
          }
        }
      });

      const payload = { presentationId: presentation._id };

      if (groupId) {
        Object.assign(payload, {
          groupId,
          roomType: 'GROUP',
        });
      }

      socket.emit(ClientToServerEventType.hostCreateRoom, payload);
    });

    return () => {
      socket.emit(ClientToServerEventType.hostStopPresentation, { presentationId: presentation._id });
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken, presentation._id, socket, groupId]);

  return (
    <Skeleton visible={!isLoading}>
      <Stack>
        <NavigationHeader
          roomId={roomId}
          invitationLink={invitationLink}
          presentationData={presentation}
          toNextSlide={toNextSlide}
          toPrevSlide={toPrevSlide}
          slideType={currentSlide.slideType}
          userVotes={userVotes}
          options={options}
        />
        <Grid>
          <Grid.Col span={9}>
            <SlideSwitcher options={options} slide={currentSlide} />
          </Grid.Col>
          <Grid.Col span={3}>
            <Stack spacing={15}>
              <ChatBox
                height="calc(50vh - 57px)"
                sendChatMessage={handleSendChatMessage}
                dataSource={chatHistory}
                loadMore={loadOldChat}
                nextOffset={nextOffset}
                isLoadMore={isLoadMore}
                setLoadMore={setLoadMore}
              />
              <HostQuestionBox
                dataSource={allQuestions}
                answerQuestion={handleAnswerQuestion}
              />
            </Stack>
          </Grid.Col>
        </Grid>
      </Stack>
    </Skeleton>
  );
}

export default function HostPresentation() {
  const locationState = useLocation().state as { groupId: string };
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
            <ShowPage presentation={presentation as PresentationWithUserInfo} groupId={locationState?.groupId} />
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
