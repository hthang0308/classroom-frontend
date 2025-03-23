import healthApi from '@/api/health';
import { Badge, Container, Divider, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core';
import { useEffect, useState } from 'react';

export default function HealthCheck() {
  const [backendStatus, setBackendStatus] = useState<string | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get backend health
    const checkBackend = async () => {
      try {
        const response = await healthApi.checkBackendHealth();
        setBackendStatus(response.data);
        setBackendError(null);
      } catch (error) {
        console.error('Backend health check failed:', error);
        setBackendError('Unable to connect to backend service');
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="lg" align="center">
        System Health Check
      </Title>

      <Stack spacing="lg">
        <Paper p="md" withBorder>
          <Group position="apart" mb="xs">
            <Title order={3}>Frontend Service</Title>
            <Badge color="green" size="lg">
              OK
            </Badge>
          </Group>
          <Divider mb="md" />
          <Text>Frontend application is running properly.</Text>
        </Paper>

        <Paper p="md" withBorder>
          <Group position="apart" mb="xs">
            <Title order={3}>Backend Service</Title>
            {loading && <Loader size="sm" />}
            {!loading && !backendError && (
              <Badge color="green" size="lg">
                OK
              </Badge>
            )}
            {backendError && (
              <Badge color="red" size="lg">
                Error
              </Badge>
            )}
          </Group>
          <Divider mb="md" />
          {loading && <Text>Checking backend status...</Text>}
          {!loading && !backendError && <Text>Backend response: {backendStatus}</Text>}
          {backendError && <Text color="red">{backendError}</Text>}
        </Paper>
      </Stack>
    </Container>
  );
}
