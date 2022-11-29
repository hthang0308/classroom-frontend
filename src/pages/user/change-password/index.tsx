import {
  PasswordInput,
  Paper,
  Container,
  Button,
  Flex,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import userApi from '@/api/user';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

interface FormProps {
  oldPassword: string;
  newPassword: string;
  retype: string;
}

export default function ChangePasswordForm() {
  const navigate = useNavigate();
  const form = useForm<FormProps>({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      retype: '',
    },
    validate: {
      newPassword: (value, values) => (value === values.oldPassword ? 'New password cannot be the same as old password' : null),
      retype: (value, values) => (value !== values.newPassword ? 'Retype must be the same as new password' : null),
    },
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: resp } = await userApi.getMe();

      if (resp.data.isEmailVerified) {
        navigate('/user/profile');
      }
    };

    checkUser();
  });

  const handleSubmitForm = async (values: FormProps) => {
    try {
      const { data } = await userApi.changePassword(values.oldPassword, values.newPassword);

      notificationManager.showSuccess('', data.message);
      navigate('/user/profile');
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          {/* <form onSubmit={form.onSubmit(null)}> */}
          <PasswordInput
            label="Old Password"
            placeholder="Your old password"
            {...form.getInputProps('oldPassword')}
            required
            mt="md"
          />
          <PasswordInput
            label="New Password"
            placeholder="Your new password"
            {...form.getInputProps('newPassword')}
            required
            mt="md"
          />
          <PasswordInput
            label="Retype"
            placeholder="Your new password again"
            {...form.getInputProps('retype')}
            required
            mt="md"
          />
          <Flex
            pt="lg"
            justify="center"
            align="center"
            gap="sm"
            sx={() => ({ '@media (max-width: 360px)': { flexDirection: 'column' } })}
          >
            <Button w={160} type="submit">Submit</Button>
            <Link to="/user/profile">
              <Button w={160} color="red">Cancel</Button>
            </Link>
          </Flex>
        </form>
      </Paper>
    </Container>
  );
}
