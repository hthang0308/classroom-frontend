import { Box, Flex, Stack, Group, TextInput, Tooltip, ActionIcon, Checkbox, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import sortBy from 'lodash.sortby';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';

import { Question } from '../types';

interface HostQuestionBoxProps {
  answerQuestion: (questionId: string) => void
  dataSource: Question[]
}

export function HostQuestionBox({ answerQuestion, dataSource }: HostQuestionBoxProps) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'time', direction: 'desc' });
  const [data, setData] = useState<Question[]>([]);
  const [sortedData, setSortedData] = useState<Question[]>(sortBy(dataSource, 'vote'));

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    const dataTemp = sortBy(data, sortStatus.columnAccessor);

    setSortedData(sortStatus.direction === 'desc' ? dataTemp.reverse() : data);
  }, [sortStatus, data]);

  const handleMarkQuestionAnswered = (questionId: string) => {
    answerQuestion(questionId);
  };

  return (
    <Box h="calc(50vh - 102px)">
      <DataTable
        columns={[
          {
            accessor: 'question',
            title: 'Question',
            textAlignment: 'left',
            sortable: true,
          },
          {
            accessor: 'totalVotes',
            title: 'Vote',
            textAlignment: 'center',
            sortable: true,
          },
          {
            accessor: 'time',
            title: 'Time',
            textAlignment: 'center',
            sortable: true,
            render: (record: Question) => (
              <Text>{(new Date(record.time)).toLocaleString('en-US')}</Text>
            ),
          },
          {
            accessor: 'isAnswered',
            title: '',
            textAlignment: 'center',
            sortable: true,
            render: (record) => (
              <Group position="center">
                <Tooltip label="Answer Question">
                  <Checkbox
                    checked={record.isAnswered}
                    onChange={() => {
                      if (!record.isAnswered) {
                        handleMarkQuestionAnswered(record.questionId);
                      }
                    }}
                  />
                </Tooltip>
              </Group>
            ),
          },
        ]}
        records={sortedData}
        noRecordsText="No questions"
        idAccessor="questionId"
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Box>
  );
}

interface UpVoteCellProps {
  data: Question
  handleUpvoteQuestion: (questionId: string) => void
}

const UpVoteCell = ({ data, handleUpvoteQuestion }: UpVoteCellProps) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <Group position="center">
      <Tooltip label="Upvote">
        <Checkbox
          checked={isChecked}
          onChange={() => {
            if (!isChecked) {
              setChecked(true);
              handleUpvoteQuestion(data.questionId);
            }
          }}
        />
      </Tooltip>
    </Group>
  );
};

interface GuestQuestionBoxProps {
  sendQuestion: (question: string) => void
  upvoteQuestion: (questionId: string) => void
  dataSource: Question[]
}

export function GuestQuestionBox({ sendQuestion, upvoteQuestion, dataSource }: GuestQuestionBoxProps) {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'time', direction: 'desc' });
  const [data, setData] = useState<Question[]>([]);
  const [sortedData, setSortedData] = useState<Question[]>(sortBy(dataSource, 'vote'));

  const form = useForm({
    initialValues: {
      question: '',
    },
  });

  useEffect(() => {
    setData(dataSource);
  }, [dataSource]);

  useEffect(() => {
    const dataTemp = sortBy(data, sortStatus.columnAccessor);

    setSortedData(sortStatus.direction === 'desc' ? dataTemp.reverse() : data);
  }, [sortStatus, data]);

  const handleSendQuestion = () => {
    const { question } = form.values;

    if (question) {
      sendQuestion(question);
      form.reset();
    }
  };

  const handleUpvoteQuestion = (questionId: string) => {
    if (questionId) {
      upvoteQuestion(questionId);
    }
  };

  return (
    <Stack spacing={2}>
      <Box h="calc(50vh - 90px)">
        <DataTable
          columns={[
            {
              accessor: 'question',
              title: 'Question',
              textAlignment: 'left',
              sortable: true,
            },
            {
              accessor: 'totalVotes',
              title: 'Vote',
              textAlignment: 'center',
              sortable: true,
            },
            {
              accessor: 'time',
              title: 'Time',
              textAlignment: 'center',
              sortable: true,
              render: (record: Question) => (
                <Text>{(new Date(record.time)).toLocaleString('en-US')}</Text>
              ),
            },
            {
              accessor: '',
              title: 'Upvote',
              textAlignment: 'center',
              render: (record: Question) => <UpVoteCell data={record} handleUpvoteQuestion={handleUpvoteQuestion} />,
            },
            {
              accessor: 'isAnswered',
              title: '',
              textAlignment: 'center',
              sortable: true,
              render: (record) => (
                <Group position="center">
                  <Tooltip label={record.isAnswered ? 'Answered' : 'Unanswered'}>
                    <Checkbox checked={record.isAnswered} readOnly />
                  </Tooltip>
                </Group>
              ),
            },
          ]}
          records={sortedData}
          idAccessor="questionId"
          noRecordsText="No questions"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </Box>
      <Flex justify="center" align="center" columnGap={5}>
        <Box sx={{ flexGrow: 2 }}>
          <TextInput
            placeholder="Type your question..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendQuestion();
              }
            }}
            {...form.getInputProps('question')}
          />
        </Box>
        <Tooltip label="Send">
          <ActionIcon
            color="blue"
            variant="light"
            size="lg"
            onClick={handleSendQuestion}
          >
            <IconSend />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Stack>
  );
}
