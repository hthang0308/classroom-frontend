import { showNotification } from '@mantine/notifications';
import {
  IconX, IconCheck, IconAlertCircle,
} from '@tabler/icons';

export function showSuccess(title: string | undefined, message: string | undefined) {
  showNotification({
    title,
    message,
    color: 'green',
    icon: <IconCheck />,
  });

  return null;
}

export function showFail(title: string | undefined, message: string | undefined) {
  showNotification({
    title,
    message,
    color: 'red',
    icon: <IconX />,
  });

  return null;
}

export function showWarning(title: string | undefined, message: string | undefined) {
  showNotification({
    title,
    message,
    color: 'yellow',
    icon: <IconAlertCircle />,
  });

  return null;
}
