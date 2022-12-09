import {
  Group, Title, Button, Tooltip, Modal, TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus } from '@tabler/icons';
import { useState } from 'react';

interface FormProps {
  name: string
}

export default function PresentationListHeader() {
  const [opened, setOpened] = useState(false);

  const form = useForm({ initialValues: { name: '' } });

  const handleOpenModal = () => {
    setOpened(true);
  };

  const handleCloseModal = () => {
    form.reset();
    setOpened(false);
  };

  const handleSubmitForm = (values: FormProps) => {
    console.log(values);
  };

  return (
    <>
      <Modal
        title="Create new presentation"
        opened={opened}
        onClose={handleCloseModal}
      >
        <form onSubmit={form.onSubmit(handleSubmitForm)}>
          <TextInput
            label="Presentation name"
            placeholder="Your presentation name"
            required
            {...form.getInputProps('name')}
          />
          <Group position="right" mt="md">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Create</Button>
          </Group>
        </form>
      </Modal>
      <Group my="lg" position="apart">
        <Title
          order={3}
          sx={(theme) => ({ color: theme.colorScheme === 'dark' ? theme.colors.gray[1] : theme.colors.dark[4] })}
        >
          My presentations
        </Title>
        <Tooltip label="Create a presentation">
          <Button onClick={handleOpenModal}>
            <IconPlus />
          </Button>
        </Tooltip>
      </Group>
    </>
  );
}
