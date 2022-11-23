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
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import config from 'config';
import Cookies from 'js-cookie';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

import { AUTH_COOKIE } from '@/utils/constants';

interface FormProps {
  name: string
  email: string
  password: string
  confirm: string
}

interface SuccessReponse {
  data: {
    id: string
    email: string
  }
  message: string
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
    const data = {
      email: values.email,
      password: values.password,
      name: values.name,
    };

    try {
      const response = await axios.post<SuccessReponse>(`${config.backendUrl}/auth/sign-up`, data);

      if (response.status === 201) {
        showNotification({
          title: 'Register successfully',
          message: response.data.message,
          color: 'green',
        });
        navigate('/login');
      }
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        showNotification({
          title: 'Register unsuccessfully',
          message: error.response?.data.message,
          color: 'red',
        });
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
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
