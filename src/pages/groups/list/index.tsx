import {
  Container, Grid, Group, Card, Image, Stack, Text, Pagination, createStyles,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import Header from './header';

import groupApi, { Group as GroupType } from '@/api/group';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

const useStyles = createStyles(() => ({
  lineClamp: {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await groupApi.getAll({ pageSize: 8, page: activePage });

        setDataSource(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
          notificationManager.showFail('', error.response?.data.message);
        }
      }
    };

    fetchData();
  }, [activePage]);

  return (
    <Container size="lg">
      <Header />
      <Grid>
        {dataSource.map((group, index) => (
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
                <Text weight={600}>{group.name}</Text>
                <Text>{group.userCreated.name}</Text>
              </Stack>

              <Text size="sm" color="dimmed" className={classes.lineClamp}>
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
