import { Container, Box, Group, Breadcrumbs, Anchor, Text, Button, ActionIcon, Tooltip, Modal, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconPlus, IconTrash } from '@tabler/icons';
import { DataTable } from 'mantine-datatable';
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';

import presentationApi, { PresentationWithUserInfo as Presentation } from '@/api/presentation';
import { CompactUser } from '@/api/types';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';

interface FormProps {
  email: string
}

export default function PresentationCollaboration() {
  const [presentationData, setPresentationData] = useState<Presentation>();
  const [collaborators, setCollaborators] = useState<CompactUser[]>([]);
  const [opened, setOpened] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const { presentationId } = useParams();

  const form = useForm<FormProps>({
    initialValues: {
      email: '',
    },
  });

  const fetchPresentationData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await presentationApi.getPresentationById(presentationId);

      setPresentationData(response.data);
      setCollaborators(response.data.collaborators);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }

    setLoading(false);
  }, [presentationId]);

  useEffect(() => {
    fetchPresentationData();
  }, [fetchPresentationData]);

  const handleOpenModal = () => {
    setOpened(true);
  };

  const handleCloseModal = () => {
    form.reset();
    setOpened(false);
  };

  const handleAddCollaborator = async ({ email }: FormProps) => {
    try {
      const { data: response } = await presentationApi.addCollaborator(presentationId, email);

      notificationManager.showSuccess('', response.message);
      handleCloseModal();
      fetchPresentationData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleRemoveCollaborator = async (email: string) => {
    try {
      const { data: response } = await presentationApi.removeCollaborator(presentationId, email);

      notificationManager.showSuccess('', response.message);
      fetchPresentationData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const breadcrumbsItems = [
    { title: 'My presentations', to: '/presentations' },
    { title: `${presentationData?.name}'s collaborators` || '', to: '#' },
  ];

  return (
    <Container size="lg">
      <Modal
        title="Add collaborator"
        opened={opened}
        onClose={handleCloseModal}
      >
        <form onSubmit={form.onSubmit(handleAddCollaborator)}>
          <TextInput
            label="Collaborator email"
            placeholder="abc@gmail.com"
            required
            {...form.getInputProps('email')}
          />
          <Group position="right" mt="md">
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit">Add</Button>
          </Group>
        </form>
      </Modal>
      <Group position="apart">
        <Breadcrumbs>
          {breadcrumbsItems.map((item, index) => (
            <Anchor key={index} component={Link} to={item.to}>
              {item.title}
            </Anchor>
          ))}
        </Breadcrumbs>
        <Group>
          <Button leftIcon={<IconPlus />} onClick={handleOpenModal}>
            <Text>Add collaborator</Text>
          </Button>
        </Group>
      </Group>

      <Box mt="xl">
        <DataTable
          columns={[
            {
              accessor: 'index',
              title: '#',
              textAlignment: 'center',
              width: 40,
              render: (_, index) => index + 1,
            },
            {
              accessor: 'name',
              title: 'Name',
            },
            {
              accessor: 'email',
              title: 'Email',
            },
            {
              accessor: 'action',
              title: '',
              width: 100,
              render: (record: CompactUser) => (
                <Group position="center">
                  <Tooltip label="Remove">
                    <ActionIcon
                      color="red"
                      variant="outline"
                      onClick={() => handleRemoveCollaborator(record.email)}
                    >
                      <IconTrash size={18} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              ),
            },
          ]}
          records={collaborators}
          idAccessor="_id"
          minHeight={450}
          verticalSpacing="sm"
          noRecordsText="No collaborators to show"
          highlightOnHover
          fetching={isLoading}
        />
      </Box>
    </Container>
  );
}
