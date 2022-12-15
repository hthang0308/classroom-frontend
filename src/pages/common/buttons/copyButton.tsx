import {
  Button, CopyButton as MantineCopyButton, MantineSize,
} from '@mantine/core';
import React from 'react';

interface CopyButtonProps {
  label?: string;
  postColor?: string;
  preColor?: string;
  size?: MantineSize;
  value: string;
}

export default function CopyButton({
  size = 'xs', value, label = value, postColor = 'teal', preColor = 'blue',
}: CopyButtonProps) {
  return (

    <MantineCopyButton value={value}>
      {({ copied, copy }) => (
        <Button size={size} color={copied ? postColor : preColor} onClick={copy}>
          {label}
        </Button>
      )}
    </MantineCopyButton>
  );
}
