import {
  Container, Box, Text, ActionIcon, Group, Menu,
} from '@mantine/core';
import {
  IconDots, IconEdit, IconPresentation, IconTrash,
} from '@tabler/icons';
import sortBy from 'lodash.sortby';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import PresentationListHeader from './header';

const FAKE_DATA = [
  {
    id: '1',
    name: 'Presentation 01',
    owner: 'me',
    modified: 'about 3 hours ago',
    created: 'about 4 hours ago',
  },
  {
    id: '2',
    name: 'Presentation 02',
    owner: 'me',
    modified: 'about 4 hours ago',
    created: 'about 5 hours ago',
  },
  {
    id: '3',
    name: 'Presentation 03',
    owner: 'Nguyen Van A',
    modified: 'about 1 hours ago',
    created: 'about 2 hours ago',
  },
  {
    id: '4',
    name: 'Presentation 04',
    owner: 'me',
    modified: 'about 2 hours ago',
    created: 'about 3 hours ago',
  },
  {
    id: '5',
    name: 'Presentation 05',
    owner: 'me',
    modified: 'about 5 hours ago',
    created: 'about 6 hours ago',
  },
];

interface PresentationType {
  id: string
  name: string
  owner: string
  modified: string
  created: string
}

export default function PresentationList() {
  const [dataSource, setDataSource] = useState<PresentationType[]>(FAKE_DATA);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'modified', direction: 'asc' });

  useEffect(() => {
    const data = sortBy(dataSource, sortStatus.columnAccessor) as PresentationType[];

    setDataSource(sortStatus.direction === 'desc' ? data.reverse() : data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortStatus]);

  const COLUMNS = [
    {
      accessor: 'name',
      title: 'Name',
      sortable: true,
      width: 400,
      render: (record: PresentationType) => (
        <Text component={Link} to={`/presentation/${record.id}`}>{record.name}</Text>
      ),
    },
    {
      accessor: 'owner',
      title: 'Owner',
      sortable: true,
    },
    {
      accessor: 'modified',
      title: 'Modified',
      sortable: true,
    },
    {
      accessor: 'created',
      title: 'Created',
      sortable: true,
    },
    {
      accessor: 'action',
      title: '',
      width: 50,
      render: (_: PresentationType) => (
        <Group position="center">
          <Menu shadow="sm" width={100}>
            <Menu.Target>
              <ActionIcon><IconDots /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<IconEdit size={18} />}>Edit</Menu.Item>
              <Menu.Item icon={<IconPresentation size={18} />}>Present</Menu.Item>
              <Menu.Divider />
              <Menu.Item color="red" icon={<IconTrash size={18} />}>Delete</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      ),
    },
  ];

  return (
    <Container size="lg">
      <PresentationListHeader />
      <Box mt="xl">
        <DataTable
          columns={COLUMNS}
          records={dataSource}
          minHeight={dataSource.length > 0 ? 0 : 150}
          verticalSpacing="sm"
          noRecordsText="No presentations to show"
          highlightOnHover
          shadow="sm"
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
        />
      </Box>
    </Container>
  );
}
