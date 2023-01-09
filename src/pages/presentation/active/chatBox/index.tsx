import { Group, Stack, Box, Flex, Paper, Text, ScrollArea, TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { useRef, useEffect, useCallback } from 'react';

import { Chat } from '../../slides/types';

import { getUserId } from '@/utils';

interface MessageBoxProps {
  message: string
  isRightSide: boolean
  sender: string
}

const MessageBox = ({ message, isRightSide, sender }: MessageBoxProps) => (
  <Group position={isRightSide ? 'right' : 'left'} my="xs">
    <Stack maw="65%" spacing={3}>
      <Group position={isRightSide ? 'right' : 'left'}>
        <Text size="sm">{sender}</Text>
      </Group>
      <Paper
        sx={(theme) => ({
          borderRadius: theme.radius.lg,
          borderTopLeftRadius: isRightSide ? theme.radius.lg : theme.radius.xs,
          borderTopRightRadius: isRightSide ? theme.radius.xs : theme.radius.lg,
          backgroundColor: isRightSide ? theme.colors.blue[6] : theme.colors.gray[2],
          color: isRightSide ? theme.colors.gray[0] : theme.colors.dark[9],
          maxWidth: '100%',
          padding: '8px 16px',
        })}
      >
        <Text>{message}</Text>
      </Paper>
    </Stack>
  </Group>
);

interface ChatBoxProps {
  height?: string | number
  sendChatMessage: (message: string) => void
  dataSource: Chat[]
  loadMore: (offset: number) => Promise<void>
  nextOffset: number
  isLoadMore: boolean
  setLoadMore: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormProps {
  message: string
}

export default function ChatBox({
  height = '', sendChatMessage, dataSource, loadMore, nextOffset, setLoadMore, isLoadMore,
}: ChatBoxProps) {
  const viewport = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLDivElement>(null);

  const currentUserId = getUserId();

  const form = useForm<FormProps>({
    initialValues: {
      message: '',
    },
  });

  useEffect(() => {
    if (isLoadMore) {
      setLoadMore(false);
    } else {
      viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource]);

  const handleSendChatMessage = () => {
    if (form.values.message) {
      sendChatMessage(form.values.message);
      form.reset();
    }
  };

  const scrollToLoadMore = useCallback(() => {
    if (viewport.current?.scrollTop === 0 && loadMore && nextOffset) {
      loadMore(nextOffset);
      setLoadMore(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadMore, nextOffset]);

  useEffect(() => {
    const element = viewport.current;

    if (element) {
      element.addEventListener('scroll', scrollToLoadMore);
    }

    return () => {
      if (element) {
        element.removeEventListener('scroll', scrollToLoadMore);
      }
    };
  }, [viewport, scrollToLoadMore]);

  return (
    <Stack spacing={2} h={height}>
      <ScrollArea
        viewportRef={viewport}
        h={`calc(100% - ${chatInputRef.current?.clientHeight || 0}px)`}
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[5] : 'white',
          padding: '0px 16px',
        })}
        offsetScrollbars
      >
        {
          dataSource.map((i, index) => (
            <MessageBox
              key={index}
              sender={i.user.name}
              message={i.message}
              isRightSide={currentUserId === i.user._id}
            />
          ))
        }
      </ScrollArea>
      <Flex justify="center" align="center" columnGap={5} ref={chatInputRef}>
        <Box sx={{ flexGrow: 2 }}>
          <TextInput
            placeholder="Type something..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendChatMessage();
              }
            }}
            {...form.getInputProps('message')}
          />
        </Box>
        <Tooltip label="Send">
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            onClick={handleSendChatMessage}
          >
            <IconSend />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Stack>
  );
}
