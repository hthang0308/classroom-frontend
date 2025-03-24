import { Anchor, Button, Container, Paper, Text, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Link, useNavigate } from 'react-router-dom';

import authApi from '@/api/auth';
import * as notificationManager from '@/pages/common/notificationManager';
import { ErrorResponse, isAxiosError } from '@/utils/axiosErrorHandler';

interface FormProps {
  email: string;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) => (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? null : 'Invalid email'),
    },
  });

  const handleSubmitForm = async (values: FormProps) => {
    try {
      const response = await authApi.forgotPassword(values.email);
      notificationManager.showSuccess('', response.data.message);
      navigate('/login');
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
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
        Forgot your password?
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput label="Email" placeholder="Your email" required {...form.getInputProps('email')} />
          <Button fullWidth mt="xl" type="submit">
            Send Reset Link
          </Button>
          <Text color="dimmed" size="sm" align="center" mt="lg">
            Remember your password?{' '}
            <Anchor component={Link} size="sm" to="/login">
              Back to login
            </Anchor>
          </Text>
        </form>
      </Paper>
    </Container>
  );
};

export default ForgotPasswordPage;
