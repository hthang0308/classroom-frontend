import { Box } from '@mantine/core';
import { DataTable } from 'mantine-datatable';

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

export default function QuestionBox() {
  const COLUMNS = [
    {
      accessor: 'question',
      title: 'Question',
    },
    {
      accessor: 'answer',
      title: 'Answer',
    },
    {
      accessor: 'vote',
      title: 'Vote',
    },
    {
      accessor: 'timestamp',
      title: 'Time Asked',
    },
  ];

  return (
    <Box h="calc(50vh - 102px)">
      <DataTable
        columns={COLUMNS}
        records={FAKE_DATA}
      />
    </Box>
  );
}
