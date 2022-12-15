import {
  Popover, Tooltip, ActionIcon, Group, Text, Button,
} from '@mantine/core';
import {
  IconUser, IconAlertCircle, IconX,
} from '@tabler/icons';
import { useState } from 'react';

import { UserRole } from '@/utils/constants';

export function ConfirmPopoverAssignRole({ role, onConfirm }: { role: string, onConfirm: () => void }) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover position="top" withArrow shadow="md" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Tooltip label="Assign role">
          <ActionIcon variant="outline" color="blue" onClick={() => setOpened((o) => !o)}>
            <IconUser />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Group position="left" spacing="xs">
          <ActionIcon size="sm" color="yellow" variant="filled">
            <IconAlertCircle />
          </ActionIcon>
          <Text size="sm">
            Assign to role
            {role === UserRole.Member ? ' Co-owner' : ' Member'}
            ?
          </Text>
        </Group>
        <Group position="right" mt="xs">
          <Button
            size="sm"
            variant="outline"
            compact
            onClick={() => setOpened(false)}
          >
            No
          </Button>
          <Button
            size="sm"
            compact
            onClick={() => {
              setOpened(false);
              onConfirm();
            }}
          >
            Yes
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

export function ConfirmPopoverKickOut({ onConfirm }: { onConfirm: () => void }) {
  const [opened, setOpened] = useState(false);

  return (
    <Popover position="top" withArrow shadow="md" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <Tooltip label="Kick out">
          <ActionIcon variant="outline" color="red" onClick={() => setOpened((o) => !o)}>
            <IconX />
          </ActionIcon>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Group position="left" spacing="xs">
          <ActionIcon size="sm" color="yellow" variant="filled">
            <IconAlertCircle />
          </ActionIcon>
          <Text size="sm">
            Kick out this user?
          </Text>
        </Group>
        <Group position="right" mt="xs">
          <Button
            size="sm"
            variant="outline"
            compact
            onClick={() => setOpened(false)}
          >
            No
          </Button>
          <Button
            size="sm"
            compact
            onClick={() => {
              setOpened(false);
              onConfirm();
            }}
          >
            Yes
          </Button>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}
