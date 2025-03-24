import {
  createStyles,
  Paper,
  Title,
  Text,
  TextInput,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import authApi from '@/api/auth';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: 26,
    fontWeight: 900,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan('xs')]: {
      flexDirection: 'column-reverse',
    },
  },

  control: {
    [theme.fn.smallerThan('xs')]: {
      width: '100%',
      textAlign: 'center',
    },
  },
}));

export default function ForgotPasswordPage() {
  const [isLoading, setLoading] = useState(false);
  const { classes } = useStyles();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmitForm = async ({ email }: { email: string }) => {
    setLoading(true);
    try {
      const { data: response } = await authApi.resetPassword(email);

      notificationManager.showSuccess('Reset password successfully', response.message);
      navigate('/login');
    } catch (error: unknown) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('Reset password unsuccessfully', error.response?.data.message);
      }
    }

    setLoading(false);
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Forgot your password?
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Email"
            placeholder="abc@gmail.com"
            required
            {...form.getInputProps('email')}
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor component={Link} color="dimmed" size="sm" className={classes.control} to="/login">
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Back to login page</Box>
              </Center>
            </Anchor>
            <Button className={classes.control} type="submit" loading={isLoading}>Reset password</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
