import { Group, Stack, Box, Flex, Paper, Text, ScrollArea, TextInput, ActionIcon, Tooltip } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import { useRef, useEffect } from 'react';

const FAKE_CHAT_DATA = [
  {
    id: '1',
    createdBy: 'A',
    content: 'Lorem ipsum',
  },
  {
    id: '2',
    createdBy: 'B',
    content: 'Lorem ipsum dolor sit amet consectetur',
  },
  {
    id: '3',
    createdBy: 'C',
    content: 'Lorem ipsum dolor sit amet consectetur',
  },
  {
    id: '4',
    createdBy: 'A',
    content: 'Lorem ipsum dolor sit amet consectetur',
  },
  {
    id: '5',
    createdBy: 'C',
    content: 'Lorem ipsum dolor sit amet consectetur',
  },
  {
    id: '6',
    createdBy: 'A',
    content: 'Lorem ipsum dolor sit amet consectetur',
  },
  {
    id: '7',
    createdBy: 'B',
    content: 'Lorem ipsum dolor sit amet consectetur',
  },
];

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

const ChatDisplay = ({ currentUser }: { currentUser: string }) => (
  <Box
    sx={() => ({
      padding: '0px 16px',
    })}
  >
    {
      FAKE_CHAT_DATA.map((i, index) => (
        <MessageBox
          key={index}
          sender={i.createdBy}
          message={i.content}
          isRightSide={currentUser === i.createdBy}
        />
      ))
    }
  </Box>
);

const ChatInput = () => {
  const form = useForm({
    initialValues: {
      message: '',
    },
  });

  return (
    <Box sx={{ flexGrow: 2 }}>
      <TextInput
        placeholder="Type something..."
        {...form.getInputProps('message')}
      />
    </Box>
  );
};

export default function ChatBox() {
  const viewport = useRef<HTMLDivElement>(null);

  useEffect(() => {
    viewport.current?.scrollTo({ top: viewport.current.scrollHeight, behavior: 'smooth' });
  }, []);

  return (
    <Stack spacing={2} h="calc(50vh - 57px)">
      <ScrollArea.Autosize
        viewportRef={viewport}
        maxHeight="90%"
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[5] : 'white',
        })}
        offsetScrollbars
      >
        <ChatDisplay currentUser="A" />
      </ScrollArea.Autosize>
      <Flex justify="center" align="center" columnGap={5}>
        <ChatInput />
        <Tooltip label="Send">
          <ActionIcon color="blue" variant="light" size="lg"><IconSend /></ActionIcon>
        </Tooltip>
      </Flex>
    </Stack>
  );
}
