import {
  PasswordInput,
  Paper,
  Container,
  Button,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React from 'react';

export default function ChangePasswordForm() {
  const form = useForm({
    initialValues: {
      oldPassword: '',
      // eslint-disable-next-line unicorn/no-keyword-prefix
      newPassword: '',
      retype: '',
    },
  });

  return (
    <Container size={420} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form>
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
          <Button fullWidth mt="xl" type="submit">
            Log in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
