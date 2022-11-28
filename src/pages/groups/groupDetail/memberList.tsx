import { Box, Group } from '@mantine/core';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import {
  useState, useEffect, useCallback,
} from 'react';
import { useParams } from 'react-router-dom';

import groupApi, { UsersInfoAndRole } from '@/api/group';
import { ConfirmPopoverAssignRole, ConfirmPopoverKickOut } from '@/pages/common/confirmPopover';
import * as notificationManager from '@/pages/common/notificationManager';
import { sortMemberListByRole, getUserId } from '@/utils';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { USER_ROLE } from '@/utils/constants';

interface PropsType {
  role: string
  setRole: React.Dispatch<React.SetStateAction<string>>
}

export default function MemberList({ role, setRole }: PropsType) {
  const [dataSource, setDataSource] = useState<UsersInfoAndRole[]>([]);
  const [fetching, setFetching] = useState(false);
  const { groupId } = useParams<string>();

  const fetchData = useCallback(async () => {
    try {
      setFetching(true);
      const { data: response } = await groupApi.getAllMembers(groupId);

      const userId = getUserId();

      const convertedData = response.data.usersAndRoles.map((item) => ({
        ...item,
        role: USER_ROLE[item.role],
      }));

      const user = convertedData.find((item) => item.user._id === userId);

      setRole(user?.role || '');
      setDataSource(sortMemberListByRole(convertedData));
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }

    setFetching(false);
  }, [groupId, setRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAssignMemberRole = async (userId: string, roleAssign: string) => {
    try {
      const { data: response } = await groupApi.assignMemberRole(groupId, userId, roleAssign);

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleKickOutMember = async (userId: string) => {
    try {
      const { data: response } = await groupApi.kickOutMember(groupId, userId);

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

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
      render: (record: UsersInfoAndRole) => {
        const onAssignRoleConfirm = () => {
          const roleAssign = record.role === USER_ROLE.MEMBER ? 'CO_OWNER' : 'MEMBER';

          handleAssignMemberRole(record.user._id, roleAssign);
        };

        return record.role !== USER_ROLE.OWNER
          ? (
            <Group position="center">
              {
                role === USER_ROLE.OWNER
                  ? (
                    <ConfirmPopoverAssignRole role={record.role} onConfirm={onAssignRoleConfirm} />
                  )
                  : null
              }
              {
                (role === USER_ROLE.OWNER || record.role === USER_ROLE.MEMBER)
                  ? (
                    <ConfirmPopoverKickOut onConfirm={() => handleKickOutMember(record.user._id)} />
                  )
                  : null
              }
            </Group>
          )
          : null;
      },
    },
  ];

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
