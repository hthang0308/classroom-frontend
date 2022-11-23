import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Divider,
  Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import config from 'config';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import GoogleButton from '../common/googleButton';

import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { AUTH_COOKIE } from '@/utils/constants';

interface FormProps {
  email: string
  password: string
  rememberMe: boolean
}

interface SuccessResponse {
  data: {
    id: string
    email: string
    token: string
  }
  message: string
}

const LoginPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get(AUTH_COOKIE)) {
      navigate('/');
    }
  }, [navigate]);

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const handleSubmitForm = async (values: FormProps) => {
    const data = {
      email: values.email,
      password: values.password,
    };

    try {
      const { data: response } = await axios.post<SuccessResponse>(`${config.backendUrl}/auth/sign-in`, data);

      Cookies.set(AUTH_COOKIE, response.data.token);

      showNotification({
        message: response.message,
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        showNotification({
          message: error.response?.data.message,
          color: 'red',
        });
      }
    }
  };

  const handleGoogleLogin = async () => {
    window.open(`${config.backendUrl}/auth/google`, '_self');
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
          color: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.dark[4],
        })}
      >
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Do not have an account yet?
        {' '}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Email"
            placeholder="Your email"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            required
            mt="md"
          />
          <Group position="apart" mt="lg">
            <Checkbox
              label="Remember me"
              sx={{ lineHeight: 1 }}
              {...form.getInputProps('rememberMe', { type: 'checkbox' })}
            />
            <Anchor size="sm" component={Link} to="/forgot-password">
              Forgot password?
            </Anchor>
          </Group>

          <Button fullWidth mt="xl" type="submit">
            Log in
          </Button>

          <Divider label="Or continue with" labelPosition="center" my="lg" />

          <Stack>
            <GoogleButton radius="xl" onClick={handleGoogleLogin}>Google</GoogleButton>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default LoginPage;
