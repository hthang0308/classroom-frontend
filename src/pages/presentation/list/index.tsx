import {
  Container, Box, Text, ActionIcon, Group, Menu, Tooltip, Modal, Button,
} from '@mantine/core';
import {
  IconEdit, IconPresentation, IconTrash, IconDots, IconUsers,
} from '@tabler/icons';
import sortBy from 'lodash.sortby';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TimeAgo from 'react-timeago';

import PresentationListHeader from './header';

import presentationApi, { PresentationWithUserInfo as PresentationType } from '@/api/presentation';
import * as notificationManager from '@/pages/common/notificationManager';
import { getUserId } from '@/utils';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

export default function PresentationList() {
  const [dataSource, setDataSource] = useState<PresentationType[]>([]);
  const [sortedDataSource, setSortedDataSource] = useState<PresentationType[]>([]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'updatedAt', direction: 'asc' });
  const [selectedPresentation, setSelectedPresentation] = useState({ name: '', id: '' });
  const [opened, setOpened] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const currentUserId = getUserId();

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data: response } = await presentationApi.getMyPresentations();

      setDataSource(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const data = sortStatus.columnAccessor === 'userCreated.name'
      ? sortBy(dataSource, ['userCreated.name', 'name']) as PresentationType[]
      : sortBy(dataSource, sortStatus.columnAccessor) as PresentationType[];

    setSortedDataSource(sortStatus.direction === 'desc' ? data : data.reverse());
  }, [sortStatus, dataSource]);

  const handleDeletePresentation = async (presentationId: string) => {
    try {
      const { data: response } = await presentationApi.deletePresentation(presentationId);

      notificationManager.showSuccess('', response.message);
      setOpened(false);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleOpenModal = (presentationName: string, presentationId: string) => {
    setOpened(true);
    setSelectedPresentation({ name: presentationName, id: presentationId });
  };

  const handleCloseModal = () => {
    setOpened(false);
  };

  const COLUMNS = [
    {
      accessor: 'name',
      title: 'Name',
      sortable: true,
      width: 400,
      render: (record: PresentationType) => (
        <Text component={Link} to={`/presentation/${record._id}/${record.slides[0]._id}/edit`}>{record.name}</Text>
      ),
    },
    {
      accessor: 'userCreated.name',
      title: 'Owner',
      sortable: true,
      render: (record: PresentationType) => (
        currentUserId === record.userCreated._id ? <Text>me</Text> : <Text>{record.userCreated.name}</Text>
      ),
    },
    {
      accessor: 'updatedAt',
      title: 'Modified',
      sortable: true,
      render: (record: PresentationType) => (
        <Tooltip label={(new Date(record.updatedAt)).toLocaleString('en-US')}>
          <Text>
            <TimeAgo date={record.updatedAt} title="" />
          </Text>
        </Tooltip>
      ),
    },
    {
      accessor: 'createdAt',
      title: 'Created',
      sortable: true,
      render: (record: PresentationType) => (
        <Tooltip label={(new Date(record.updatedAt)).toLocaleString('en-US')}>
          <Text>
            <TimeAgo date={record.createdAt} title="" />
          </Text>
        </Tooltip>
      ),
    },
    {
      accessor: 'action',
      title: '',
      width: 150,
      render: (record: PresentationType) => (
        <Group position="center">
          <Menu shadow="sm" width={150}>
            <Menu.Target>
              <ActionIcon><IconDots /></ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                component={Link}
                to={`/presentation/${record._id}/${record.slides[0]._id}/edit`}
                icon={<IconEdit size={18} />}
              >
                Edit
              </Menu.Item>

              {
                currentUserId === record.userCreated._id
                  ? (
                    <>
                      <Menu.Item
                        component={Link}
                        to={`/presentation/active/${record._id}`}
                        icon={<IconPresentation size={18} />}
                      >
                        Present
                      </Menu.Item>
                      <Menu.Item
                        component={Link}
                        to={`/presentation/${record._id}/collaboration`}
                        icon={<IconUsers size={18} />}
                      >
                        Collaboration
                      </Menu.Item>
                      <Menu.Divider />
                      <Menu.Item
                        color="red"
                        icon={<IconTrash size={18} />}
                        onClick={() => handleOpenModal(record.name, record._id)}
                      >
                        Delete
                      </Menu.Item>
                    </>
                  )
                  : null
              }
            </Menu.Dropdown>
          </Menu>
        </Group>
      ),
    },
  ];

  return (
    <Container size="lg">
      <Modal
        title={`Delete "${selectedPresentation.name}"?`}
        opened={opened}
        onClose={handleCloseModal}
      >
        <Group position="right" mt={16}>
          <Button color="dark" variant="subtle" onClick={handleCloseModal}>Cancel</Button>
          <Button color="red" onClick={() => handleDeletePresentation(selectedPresentation.id)}>Delete</Button>
        </Group>
      </Modal>
      <PresentationListHeader fetchData={fetchData} />
      <Box mt="xl">
        <DataTable
          columns={COLUMNS}
          records={sortedDataSource}
          idAccessor="_id"
          minHeight={400}
          verticalSpacing="sm"
          noRecordsText="No presentations to show"
          highlightOnHover
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          fetching={isLoading}
        />
      </Box>
    </Container>
  );
}
