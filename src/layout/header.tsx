import {
  createStyles,
  Avatar,
  Header,
  Group,
  Divider,
  Box,
  Burger,
  Drawer,
  Image,
  ScrollArea, useMantineColorScheme, Menu, Button,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconBellRinging } from '@tabler/icons';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import presentationApi from '@/api/presentation';
import BlackLogo from '@/assets/logo-low-res-black.png';
import WhiteLogo from '@/assets/logo-low-res-white.png';

import useUserInfo, { UserInfo } from '@/hooks/useUserInfo';
import ThemeSwitcher from '@/pages/common/buttons/themeSwitcher';
import * as notificationManager from '@/pages/common/notificationManager';
import { ErrorResponse, isAxiosError } from '@/utils/axiosErrorHandler';

const useStyles = createStyles((theme) => ({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  link: {
    display: 'flex',
    alignItems: 'center',
    height: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    textDecoration: 'none',
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,

    [theme.fn.smallerThan('sm')]: {
      height: 42,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
    },

    ...theme.fn.hover({ backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0] }),
  },

  hiddenMobile: { [theme.fn.smallerThan('sm')]: { display: 'none' } },

  hiddenDesktop: { [theme.fn.largerThan('sm')]: { display: 'none' } },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserAvatar = ({ userInfo }: { userInfo: UserInfo }) => (
  <Avatar src={`https://avatars.dicebear.com/api/identicon/${userInfo.email}.svg`} size="sm" />
);

const NavLinks = () => {
  const { classes } = useStyles();

  const [presentations, setPresentations] = useState<any[]>([]);

  const loadActiveGroupPresentation = useCallback(async () => {
    try {
      const { data: response } = await presentationApi.getActiveGroupPresentation();

      setPresentations(response.data);
      // setAllQuestions(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, []);

  useEffect(() => {
    // load active group presentation every 5 seconds and when component is mounted
    loadActiveGroupPresentation();
    const interval = setInterval(() => {
      loadActiveGroupPresentation();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Link to="/groups" className={classes.link}>
        Groups
      </Link>
      <Link to="/presentations" className={classes.link}>
        Presentations
      </Link>
      {presentations.length > 0 && (
        <Menu position="bottom-end" shadow="md">
          <Menu.Target>
            <Button>
              <IconBellRinging />
              {presentations.length}
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            {presentations.map((presentation) => (
              <Menu.Item color="red" key={presentation.roomId}>
                <Link to={`/presentation/join?roomId=${presentation.roomId}`} className={classes.link}>
                  {presentation.groupName}
                </Link>
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      ) }
    </>
  );
};

const RightButtons = () => {
  const { userInfo } = useUserInfo();

  return (
    <>
      <ThemeSwitcher />
      {
        userInfo
          ? (
            <Link to="/user/profile">
              <UserAvatar userInfo={userInfo} />
            </Link>
          )
          : null
      }
    </>
  );
};

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] = useDisclosure(false);
  const { classes, theme } = useStyles();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box>
      <Header height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <Link to="/">
            <Image src={colorScheme === 'light' ? BlackLogo : WhiteLogo} height={30} width="auto" />
          </Link>

          <Group sx={{ height: '100%' }} spacing={0} className={classes.hiddenMobile}>
            <NavLinks />
          </Group>

          <Group className={classes.hiddenMobile}>
            <RightButtons />
          </Group>

          <Burger opened={drawerOpened} onClick={toggleDrawer} className={classes.hiddenDesktop} />
        </Group>
      </Header>

      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        title="Navigation"
        className={classes.hiddenDesktop}
        zIndex={1_000_000}
      >
        <ScrollArea sx={{ height: 'calc(100vh - 60px)' }} mx="-md">
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />
          <NavLinks />
          <Divider my="sm" color={theme.colorScheme === 'dark' ? 'dark.5' : 'gray.1'} />
          <Group position="center" grow pb="xl" px="md">
            <RightButtons />
          </Group>
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
