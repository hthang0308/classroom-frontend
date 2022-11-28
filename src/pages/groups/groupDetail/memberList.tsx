import {
  Box, Group, ActionIcon, Tooltip,
} from '@mantine/core';
import { IconX, IconUser } from '@tabler/icons';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import groupApi, { UsersInfoAndRole } from '@/api/group';
import * as notificationManager from '@/pages/common/notificationManager';
import {
  sortMemberListByRole,
  getUserInfo,
} from '@/utils';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { USER_ROLE } from '@/utils/constants';

interface PropsType {
  role: string,
  setRole: React.Dispatch<React.SetStateAction<string>>
}

const COLUMNS: DataTableColumn<UsersInfoAndRole>[] = [
  {
    accessor: 'index',
    title: '#',
    textAlignment: 'center',
    width: 40,
    render: (_: UsersInfoAndRole, index: number) => index + 1,
  },
  { accessor: 'user.name', title: 'Name' },
  { accessor: 'user.email', title: 'Email' },
  { accessor: 'role', textAlignment: 'center' },
];

const ACTION_COLUMNS: DataTableColumn<UsersInfoAndRole>[] = [
  {
    accessor: 'action',
    title: 'Action',
    textAlignment: 'center',
    width: 100,
    render: (record: UsersInfoAndRole) => (
      record.role !== USER_ROLE.OWNER
        ? (
          <Group position="center">
            <Tooltip label="Assign role" key="assign">
              <ActionIcon variant="outline" color="blue">
                <IconUser />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Kick out">
              <ActionIcon variant="outline" color="red">
                <IconX />
              </ActionIcon>
            </Tooltip>
          </Group>
        )
        : null
    ),
  },
];

export default function MemberList({ role, setRole }: PropsType) {
  const [dataSource, setDataSource] = useState<UsersInfoAndRole[]>([]);
  const [fetching, setFetching] = useState(false);
  const { groupId } = useParams<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const { data: response } = await groupApi.getAllMembers(groupId);

        const userInfo = await getUserInfo();

        const convertedData = response.data.usersAndRoles.map((item) => ({
          ...item,
          role: USER_ROLE[item.role],
        }));

        // eslint-disable-next-line no-underscore-dangle
        const user = convertedData.find((item) => item.user._id === userInfo?._id);

        setRole(user?.role || '');
        setDataSource(sortMemberListByRole(convertedData));
      } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
          notificationManager.showFail('', error.response?.data.message);
        }
      }

      setFetching(false);
    };

    fetchData();
  }, [groupId, setRole]);

  return (
    <Box mt="xl">
      <DataTable
        columns={role !== USER_ROLE.MEMBER ? [...COLUMNS, ...ACTION_COLUMNS] : COLUMNS}
        records={dataSource}
        idAccessor="user._id"
        minHeight={dataSource.length > 0 ? 0 : 150}
        verticalSpacing="sm"
        borderRadius="md"
        withBorder
        withColumnBorders
        fetching={fetching}
      />
    </Box>
  );
}
