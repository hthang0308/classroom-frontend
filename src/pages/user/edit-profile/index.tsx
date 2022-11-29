import {
  Avatar, Button, Container, Text, TextInput, Textarea, Paper, Stack, Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import userApi from '@/api/user';
import useUserInfo from '@/hooks/useUserInfo';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

interface FormProps {
  name: string;
  description: string;
}

export default function ProfileEditor() {
  const { userInfo: cookieUserInfo } = useUserInfo();
  const [email, setEmail] = useState(cookieUserInfo?.email || '');
  const navigate = useNavigate();
  const avatarUrl = `https://avatars.dicebear.com/api/identicon/${email}.svg`;

  const form = useForm<FormProps>({
    initialValues: {
      name: cookieUserInfo?.name || '',
      description: cookieUserInfo?.description || '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: response } = await userApi.getMe();

        form.setValues(response.data);
        setEmail(response.data.email);
      } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
          notificationManager.showFail('', error.response?.data.message);
        }
      }
    };

    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitForm = async (values: FormProps) => {
    try {
      await userApi.updateMe(values.name, values.description);

      notificationManager.showSuccess('', 'Update user success');

      navigate('/user/profile');
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  return (
    <Container size="xs" px="xs">
      <Paper
        radius="md"
        withBorder
        p="lg"
        sx={(theme) => ({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.white })}
      >
        <Stack>
          <Flex direction="column" justify="center" align="center">
            <Paper
              radius="md"
              withBorder
              p="lg"
              sx={(theme) => ({
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[0],
                width: 'fit-content',
              })}
            >
              <Avatar variant="filled" src={avatarUrl} size={100} mx={20} />
            </Paper>
            <Text size="lg" weight={200} mt="md">
              {email}
            </Text>
          </Flex>
          <form onSubmit={form.onSubmit(handleSubmitForm)}>
            <Stack spacing="lg">
              <TextInput
                label="Name"
                placeholder="your name"
                required
                {...form.getInputProps('name')}
              />
              <Textarea
                label="Description"
                placeholder="Write a quote that you like here"
                required
                {...form.getInputProps('description')}
              />
              <Flex
                justify="center"
                align="center"
                gap="sm"
                sx={() => ({ '@media (max-width: 360px)': { flexDirection: 'column' } })}
              >
                <Button w={160} color="green" type="submit">Submit</Button>
                <Link to="/user/profile">
                  <Button w={160} color="red">Cancel</Button>
                </Link>
              </Flex>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Container>
  );
}
