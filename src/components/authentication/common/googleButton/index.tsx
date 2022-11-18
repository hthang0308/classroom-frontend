import {
  Button,
  ButtonProps,
} from '@mantine/core';

import GoogleIcon from './googleIcon';

interface Props extends ButtonProps {
  onClick: () => void
}

const GoogleButton = (props: Props) => (
  <Button
    leftIcon={<GoogleIcon />}
    variant="default"
    color="gray"
    {...props}
  />
);

export default GoogleButton;
