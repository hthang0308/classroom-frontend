import {
  Avatar, Button, Blockquote, Container, Text, Paper, Group, Stack, Spoiler, Flex,
} from '@mantine/core';

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useUserInfo, { UserInfo } from '@/hooks/useUserInfo';
import * as AxiosRequester from '@/utils/axiosRequester';

function TrueUserProfile(info: UserInfo) {
  const [userInfo, setUserInfo] = useState<UserInfo>(info);
  const avatarUrl = `https://avatars.dicebear.com/api/identicon/${userInfo.email}.svg`;

  useEffect(() => {
    AxiosRequester.get('/user/me', {})
      .then(({ data }) => { setUserInfo(data.data); })
      .catch();
  }, []);

  return (
    <Container size="xs" px="xs">
      <Stack>
        <Paper
          radius="md"
          withBorder
          p="lg"
          sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white })}
        >
          <Stack>
            <Group position="left">
              <Paper
                radius="md"
                withBorder
                p="lg"
                sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0] })}
              >

                <Avatar variant="filled" src={avatarUrl} size={100} mx={20} />
              </Paper>
              <Stack>
                <Text size="lg" weight={500} mt="md">
                  {userInfo.name}
                </Text>
                <Text size="lg" weight={200} mt="md">
                  {userInfo.email}
                </Text>
              </Stack>
            </Group>
            <Blockquote>
              <Spoiler maxHeight={120} showLabel="Show more" hideLabel="Hide" transitionDuration={0}>
                {userInfo.description || ''}
              </Spoiler>
            </Blockquote>
          </Stack>
        </Paper>

        <Flex
          justify="center"
          align="center"
          gap="sm"
          sx={() => ({ '@media (max-width: 520px)': { flexDirection: 'column' } })}
        >
          <Link to="/user/change-password">
            <Button color="red" w={160}>Change password</Button>
          </Link>
          <Link to="/user/edit-profile">
            <Button w={160}>Edit Profile</Button>
          </Link>
          <Link to="/logout">
            <Button w={160} variant="outline" color="gray">Logout</Button>
          </Link>
        </Flex>
      </Stack>
    </Container>

  );
}

function NullUserProfile() {
  return (
    <div>Nothing here</div>
  );
}

export default function UserProfile() {
  const { userInfo } = useUserInfo();

  return userInfo ? <TrueUserProfile {...userInfo} /> : <NullUserProfile />;
}
