import {
  Container, Grid, Group, Card, Image, Stack, Text, Pagination, createStyles, Tooltip,
} from '@mantine/core';
import {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { Link } from 'react-router-dom';

import Header from './header';

import groupApi, { Group as GroupType } from '@/api/group';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

const GROUPS_PER_PAGE = 8;

const useStyles = createStyles(() => ({
  lineClamp1: {
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  lineClamp3: {
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
}));

export default function GroupsPage() {
  const { classes } = useStyles();
  const [dataSource, setDataSource] = useState<GroupType[]>([]);
  const [activePage, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      const { data: response } = await groupApi.getMyGroups();

      setDataSource(response.data);
      setTotalPages(Math.ceil(response.data.length / GROUPS_PER_PAGE));
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const currentDataSource: GroupType[] = useMemo(() => {
    const startIndex = (activePage - 1) * GROUPS_PER_PAGE;
    const groups = dataSource.slice(startIndex, startIndex + GROUPS_PER_PAGE);

    return groups;
  }, [activePage, dataSource]);

  return (
    <Container size="lg">
      <Header fetchData={fetchData} />
      <Grid>
        {currentDataSource.map((group, index) => (
          <Grid.Col key={index} span={3}>
            <Card
              component={Link}
              // eslint-disable-next-line no-underscore-dangle
              to={`/group/${group._id}`}
              shadow="sm"
              p="lg"
              radius="md"
              h={333}
              withBorder
            >
              <Card.Section>
                <Image
                  src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1122&q=80"
                  height={160}
                  alt="Cover image"
                />
              </Card.Section>

              <Stack mt="md" mb="xs" spacing="xs">
                <Tooltip label={group.name} position="top-start">
                  <Text weight={600} className={classes.lineClamp1}>{group.name}</Text>
                </Tooltip>
                <Text className={classes.lineClamp1}>{group.userCreated.name}</Text>
              </Stack>

              <Text size="sm" color="dimmed" className={classes.lineClamp3}>
                {group.description}
              </Text>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      <Group position="right" mt="lg">
        <Pagination page={activePage} onChange={setPage} total={totalPages} />
      </Group>
    </Container>
  );
}
