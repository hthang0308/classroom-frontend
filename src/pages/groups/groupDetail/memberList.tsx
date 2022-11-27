import {
  Box, Group, ActionIcon, Tooltip,
} from '@mantine/core';
import { IconX, IconUser } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import groupApi, { UsersInfoAndRole } from '@/api/group';
import * as notificationManager from '@/pages/common/notificationManager';
import sortMemberListByRole from '@/utils';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { USER_ROLE } from '@/utils/constants';

export default function MemberList() {
  const [dataSource, setDataSource] = useState<UsersInfoAndRole[]>([]);
  const [fetching, setFetching] = useState(false);
  const { groupId } = useParams<string>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setFetching(true);
        const { data: response } = await groupApi.getAllMembers(groupId);

        const convertedData = response.data.usersAndRoles.map((item) => ({
          ...item,
          role: USER_ROLE[item.role],
        }));

        setDataSource(sortMemberListByRole(convertedData));
      } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
          notificationManager.showFail('', error.response?.data.message);
        }
      }

      setFetching(false);
    };

    fetchData();
  }, [groupId]);

  return (
    <Box>
      <DataTable
        columns={[
          {
            accessor: 'index',
            title: '#',
            textAlignment: 'center',
            width: 40,
            render: (_, index) => index + 1,
          },
          { accessor: 'user.name', title: 'Name' },
          { accessor: 'user.email', title: 'Email' },
          { accessor: 'role', textAlignment: 'center' },
          {
            accessor: 'action',
            title: 'Action',
            textAlignment: 'center',
            width: 100,
            render: () => (
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
            ),
          },
        ]}
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
