import {
  Button, Group, Title, Tooltip, Modal, TextInput, Textarea,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';

import groupApi from '@/api/group';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

interface Props {
  fetchData: () => void
}

interface FormProps {
  name: string
  desc: string
}

export default function Header({ fetchData }: Props) {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      desc: '',
    },
  });

  const handleOpenModal = () => {
    form.reset();
    setOpened(true);
  };

  const handleCloseModal = () => {
    form.reset();
    setOpened(false);
  };

  const handleSubmitForm = async (values: FormProps) => {
    try {
      const { data: response } = await groupApi.createGroup(values.name, values.desc);

      notificationManager.showSuccess('', response.message);
      handleCloseModal();
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  return (
    <>
      <Modal
        title="Create a group"
        opened={opened}
        onClose={handleCloseModal}
      >
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Name"
            placeholder="Your group name"
            required
            {...form.getInputProps('name')}
          />
          <Textarea
            label="Description"
            placeholder="Your group description"
            my="md"
            {...form.getInputProps('desc')}
          />
          <Group position="center">
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>
      <Group my="lg" position="apart">
        <Title order={3}>Groups</Title>
        <Tooltip label="Create a group">
          <Button onClick={handleOpenModal}>
            <IconPlus />
          </Button>
        </Tooltip>
      </Group>
    </>
  );
}
