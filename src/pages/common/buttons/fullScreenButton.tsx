import { Button } from '@mantine/core';
import { useFullscreen } from '@mantine/hooks';
import { IconArrowsMinimize, IconArrowsMaximize } from '@tabler/icons';

export default function FullScreenButton() {
  const { toggle, fullscreen } = useFullscreen();

  return (
    <Button
      onClick={toggle}
      color={fullscreen ? 'red' : 'blue'}
      leftIcon={fullscreen ? <IconArrowsMinimize /> : <IconArrowsMaximize />}
      variant="outline"
    >
      {fullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
    </Button>
  );
}
