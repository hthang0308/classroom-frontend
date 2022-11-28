import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import authApi from '@/api/auth';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

import { AUTH_COOKIE } from '@/utils/constants';

interface FormProps {
  name: string
  email: string
  password: string
  confirm: string
}

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (Cookies.get(AUTH_COOKIE)) {
      navigate('/');
    }
  }, [navigate]);

  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      confirm: '',
    },
    validate: {
      email: (value) => (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
      confirm: (value, values) => (value !== values.password ? 'Password and Confirm Password must be match' : null),
    },
  });

  const handleSubmitForm = async (values: FormProps) => {
    try {
      const response = await authApi.signUp(values.email, values.password, values.name);

      if (response.status === 201) {
        notificationManager.showSuccess('Register successfully', response.data.message);
        navigate('/login');
      }
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('Register unsuccessfully', error.response?.data.message);
      }
    }
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
        Welcome to Classroom Management!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?
        {' '}
        <Anchor component={Link} size="sm" to="/login">
          Login
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Name"
            placeholder="Your name"
            {...form.getInputProps('name')}
            required
          />
          <TextInput
            label="Email"
            placeholder="Your email"
            {...form.getInputProps('email')}
            mt="md"
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            {...form.getInputProps('password')}
            mt="md"
            required
          />
          <PasswordInput
            label="Confirm password"
            placeholder="Confirm your password"
            {...form.getInputProps('confirm')}
            mt="md"
            required
          />
          <Button fullWidth mt="xl" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
