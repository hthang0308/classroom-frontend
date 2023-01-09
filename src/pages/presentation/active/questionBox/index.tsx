import { Box, Flex, Stack, Group, TextInput, Tooltip, ActionIcon, Checkbox } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons';
import sortBy from 'lodash.sortby';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';

const FAKE_DATA = [
  {
    id: '1',
    question: 'Compellingly formulate frictionless action items',
    answer: false,
    vote: 5,
    timestamp: '04/01/2022',
  },
  {
    id: '2',
    question: 'Compellingly formulate frictionless action items',
    answer: false,
    vote: 10,
    timestamp: '03/01/2022',
  },
  {
    id: '3',
    question: 'Compellingly formulate frictionless action items',
    answer: true,
    vote: -7,
    timestamp: '07/01/2022',
  },
  {
    id: '4',
    question: 'Compellingly formulate frictionless action items',
    answer: true,
    vote: 0,
    timestamp: '05/01/2022',
  },
  {
    id: '5',
    question: 'Compellingly formulate frictionless action items',
    answer: false,
    vote: -10,
    timestamp: '01/01/2022',
  },
  {
    id: '6',
    question: 'Compellingly formulate frictionless action items',
    answer: true,
    vote: -7,
    timestamp: '07/01/2022',
  },
  {
    id: '7',
    question: 'Compellingly formulate frictionless action items',
    answer: true,
    vote: 0,
    timestamp: '05/01/2022',
  },
  {
    id: '8',
    question: 'Compellingly formulate frictionless action items',
    answer: false,
    vote: -10,
    timestamp: '01/01/2022',
  },
];

const QuestionInput = () => {
  const form = useForm({
    initialValues: {
      message: '',
    },
  });

  return (
    <Box sx={{ flexGrow: 2 }}>
      <TextInput
        placeholder="Type your question..."
        {...form.getInputProps('message')}
      />
    </Box>
  );
};

export function HostQuestionBox() {
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'vote', direction: 'desc' });
  const [dataSource, setDataSource] = useState(FAKE_DATA);
  const [sortedData, setSortedData] = useState(sortBy(dataSource, 'vote'));

  useEffect(() => {
    const data = sortBy(dataSource, sortStatus.columnAccessor);

    setSortedData(sortStatus.direction === 'desc' ? data.reverse() : data);
  }, [sortStatus, dataSource]);

  const handleChangeQuestionStatus = (value: boolean, id: string) => {
    setDataSource(dataSource.map((i) => (i.id === id ? ({ ...i, answer: value }) : i)));
  };

  return (
    <Box h="calc(50vh - 102px)">
      <DataTable
        columns={[
          {
            accessor: 'question',
            title: 'Question',
            textAlignment: 'left',
          },
          {
            accessor: 'vote',
            title: 'Vote',
            textAlignment: 'center',
            sortable: true,
          },
          {
            accessor: 'timestamp',
            title: 'Time Asked',
            textAlignment: 'center',
            sortable: true,
          },
          {
            accessor: 'answer',
            title: '',
            textAlignment: 'center',
            sortable: true,
            render: (record) => (
              <Group position="center">
                <Tooltip label={record.answer ? 'Answered' : 'Unanswer'}>
                  <Checkbox
                    checked={record.answer}
                    onChange={(e) => handleChangeQuestionStatus(e.target.checked, record.id)}
                  />
                </Tooltip>
              </Group>
            ),
          },
        ]}
        records={sortedData}
        noRecordsText="No questions"
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
      />
    </Box>
  );
}

export function GuestQuestionBox() {
  return (
    <Stack spacing={2}>
      <Box h="calc(50vh - 90px)">
        <DataTable
          columns={[
            {
              accessor: 'question',
              title: 'Question',
              textAlignment: 'left',
            },
            {
              accessor: 'answer',
              title: 'Answer',
              textAlignment: 'center',
            },
            {
              accessor: 'vote',
              title: 'Vote',
              textAlignment: 'center',
            },
            {
              accessor: 'timestamp',
              title: 'Time Asked',
              textAlignment: 'center',
            },
          ]}
          records={FAKE_DATA}
          noRecordsText="No questions"
        />
      </Box>
      <Flex justify="center" align="center" columnGap={5}>
        <QuestionInput />
        <Tooltip label="Send">
          <ActionIcon color="blue" variant="light" size="lg"><IconSend /></ActionIcon>
        </Tooltip>
      </Flex>
    </Stack>
  );
}
