import {
  Avatar, Button, Blockquote, Container, Text, Paper, Group, Stack, Spoiler, Flex, Tooltip,
} from '@mantine/core';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import userApi from '@/api/user';
import useUserInfo, { UserInfo } from '@/hooks/useUserInfo';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

function TrueUserProfile(info: UserInfo) {
  const [userInfo, setUserInfo] = useState<UserInfo>(info);
  const avatarUrl = `https://avatars.dicebear.com/api/identicon/${userInfo.email}.svg`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await userApi.getMe();

        setUserInfo(response.data);
      } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
          notificationManager.showFail('', error.response?.data.message);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <Container size="xs" px="xs">
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
        <Flex
          justify="center"
          align="center"
          gap="sm"
          sx={() => ({ '@media (max-width: 520px)': { flexDirection: 'column' } })}
        >
          {
            userInfo.isLoggedInWithGoogle
              ? (
                <Tooltip withArrow label="User logged in with Google account cannot change their password">
                  {/* wrap disabled button inside another div to make it show properly  */}
                  <div>
                    <Button
                      style={{ color: 'inherit' }}
                      disabled
                      w={160}
                    >
                      Change password
                    </Button>
                  </div>
                </Tooltip>
              )
              : (
                <Link to="/user/change-password">
                  <Button color="red" w={160}>Change password</Button>
                </Link>
              )
          }
          <Link to="/user/edit-profile">
            <Button w={160}>Edit Profile</Button>
          </Link>
          <Link to="/logout">
            <Button w={160} color="grape">Logout</Button>
          </Link>
        </Flex>
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
