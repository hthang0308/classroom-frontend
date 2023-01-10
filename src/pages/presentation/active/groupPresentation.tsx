import { Container, Box, Group, Title, ActionIcon, Tooltip } from '@mantine/core';
import { IconPresentation } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import groupApi, { Group as GroupType } from '@/api/group';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

export default function GroupPresentation() {
  const [myGroups, setMyGroups] = useState<GroupType[]>([]);
  const { presentationId } = useParams();
  const navigate = useNavigate();

  const fetchMyCreatedGroup = useCallback(async () => {
    try {
      const { data: response } = await groupApi.getMyCreatedGroups();

      setMyGroups(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchMyCreatedGroup();
  }, [fetchMyCreatedGroup]);

  const handleChoosGroupToPresent = (groupId: string) => {
    navigate(`/presentation/active/${presentationId}`, { state: { groupId } });
  };

  return (
    <Container size="lg">
      <Group position="left">
        <Title order={3}>Present in your group</Title>
      </Group>

      <Box mt="xl">
        <DataTable
          columns={[
            {
              accessor: 'index',
              title: '#',
              textAlignment: 'center',
              width: 40,
              render: (_, index) => index + 1,
            },
            {
              accessor: 'name',
              title: 'Name',
            },
            {
              accessor: 'action',
              title: '',
              width: 100,
              render: (record: GroupType) => (
                <Group position="center">
                  <Tooltip label="Choose this group">
                    <ActionIcon
                      color="blue"
                      variant="outline"
                      onClick={() => handleChoosGroupToPresent(record._id)}
                    >
                      <IconPresentation size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ),
            },
          ]}
          records={myGroups}
          idAccessor="_id"
          minHeight={450}
          verticalSpacing="sm"
          noRecordsText="You have not create any groups"
          highlightOnHover
        />
      </Box>
    </Container>
  );
}
