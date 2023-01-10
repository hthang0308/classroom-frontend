import {
  createStyles,
  Paper,
  Title,
  Text,
  Button,
  Container,
  Group,
  Anchor,
  Center,
  Box,
  PasswordInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowLeft } from '@tabler/icons';
import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

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

interface FormProps {
  password: string
  confirm: string
}

export default function RenewPasswordPage() {
  const [isLoading, setLoading] = useState(false);
  const { classes } = useStyles();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const form = useForm({
    initialValues: {
      password: '',
      confirm: '',
    },
    validate: {
      password: (value) => (value.length < 6 ? 'Password should include at least 6 characters' : null),
      confirm: (value, values) => (value !== values.password ? 'Password and Confirm Password must be match' : null),
    },
  });

  const handleSubmitForm = async ({ password }: FormProps) => {
    if (token) {
      setLoading(true);
      try {
        const { data: response } = await authApi.renewPassword(token, password);

        notificationManager.showSuccess('Change password successfully', response.message);
        navigate('/login');
      } catch (error: unknown) {
        if (isAxiosError<ErrorResponse>(error)) {
          notificationManager.showFail('Change password unsuccessfully', error.response?.data.message);
        }
      }

      setLoading(false);
    }
  };

  return (
    <Container size={460} my={30}>
      <Title className={classes.title} align="center">
        Change your password
      </Title>
      <Text color="dimmed" size="sm" align="center">
        Enter your new password
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <PasswordInput
            label="New password"
            placeholder="Your new password"
            required
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Confirm your new password"
            mt="md"
            required
            {...form.getInputProps('confirm')}
          />
          <Group position="apart" mt="lg" className={classes.controls}>
            <Anchor component={Link} color="dimmed" size="sm" className={classes.control} to="/login">
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5}>Back to login page</Box>
              </Center>
            </Anchor>
            <Button className={classes.control} type="submit" loading={isLoading}>Change password</Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
