import {
  Avatar, Container, Text, Paper,
} from '@mantine/core';

import React, { useState, useEffect } from 'react';

import useUserInfo, { UserInfo } from '@/hooks/useUserInfo';
import * as AxiosRequester from '@/utils/axiosRequester';

function TrueUserProfile(info: UserInfo) {
  const avatarUrl = 'https://gravatar.com/avatar/c013231eaf528ceff166587be3ebcefc?s=400&d=robohash&r=x';
  const [userInfo, setUserInfo] = useState<UserInfo>(info);

  useEffect(() => {
    AxiosRequester.get('/user/me', {})
      .then(({ data }) => { setUserInfo(data.data); })
      .catch();
  }, []);

  return (
    <Container size="xs" px="xs">
      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white })}
      >
        <Avatar variant="filled" src={avatarUrl} size={120} radius={120} mx="auto" />
        <Text align="center" size="lg" weight={500} mt="md">
          {userInfo.name}
        </Text>
        <Text align="center" size="lg" weight={500} mt="md">
          {userInfo.email}
        </Text>
        <Text align="center" size="lg" weight={500} mt="md">
          {userInfo.description || ''}
        </Text>
      </Paper>
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
