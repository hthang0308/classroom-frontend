import {
  Button,
  ButtonProps,
} from '@mantine/core';

import GoogleIcon from './googleIcon';

const GoogleButton = (props: ButtonProps) => <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;

export default GoogleButton;
