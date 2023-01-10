import {
  createStyles, Avatar, Header, Group, Divider, Box, Burger, Drawer, Image,
  ScrollArea, useMantineColorScheme, Menu, Button, ActionIcon, Indicator,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBellRinging } from '@tabler/icons';
import Cookies from 'js-cookie';
import { useCallback, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import presentationApi, { ActivePresentationRoom } from '@/api/presentation';
import BlackLogo from '@/assets/logo-low-res-black.png';
import WhiteLogo from '@/assets/logo-low-res-white.png';

import useUserInfo, { UserInfo } from '@/hooks/useUserInfo';
import ThemeSwitcher from '@/pages/common/buttons/themeSwitcher';

import { AUTH_COOKIE } from '@/utils/constants';

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

const UserAvatar = ({ userInfo }: { userInfo: UserInfo }) => (
  <Avatar src={`https://avatars.dicebear.com/api/identicon/${userInfo.email}.svg`} size="sm" />
);

const NavLinks = () => {
  const { classes } = useStyles();

  return (
    <>
      <Link to="/groups" className={classes.link}>
        Groups
      </Link>
      <Link to="/presentations" className={classes.link}>
        Presentations
      </Link>
    </>
  );
};

const RightButtons = () => {
  const { userInfo } = useUserInfo();

  const intervalId = useRef<number>();

  const [activeRooms, setActiveRooms] = useState<ActivePresentationRoom[]>([]);

  const loadActiveGroupPresentation = useCallback(async () => {
    if (!Cookies.get(AUTH_COOKIE)) {
      return;
    }

    try {
      const { data: response } = await presentationApi.getActiveGroupPresentation();

      setActiveRooms(response.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }, []);

  useEffect(() => {
    loadActiveGroupPresentation();
    intervalId.current = window.setInterval(() => {
      loadActiveGroupPresentation();
    }, 5000);

    return () => window.clearInterval(intervalId.current);
  }, [loadActiveGroupPresentation]);

  return (
    <Group spacing="xl">
      <ThemeSwitcher />
      <Menu position="bottom-end" shadow="md">
        <Menu.Target>
          <Indicator label={activeRooms.length} showZero={false} inline dot={false} size={16}>
            <ActionIcon>
              <IconBellRinging size={28} />
            </ActionIcon>
          </Indicator>
        </Menu.Target>
        <Menu.Dropdown>
          {
            activeRooms.length > 0
              ? (
                activeRooms.map((i) => (
                  <Menu.Item key={i.roomId} component={Link} to={`/presentation/join?roomId=${i.roomId}`}>
                    {i.groupName}
                  </Menu.Item>
                ))
              )
              : <Menu.Item>No presentation now</Menu.Item>
          }
        </Menu.Dropdown>
      </Menu>
      {
        userInfo
          ? (
            <Link to="/user/profile">
              <UserAvatar userInfo={userInfo} />
            </Link>
          )
          : null
      }
    </Group>
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
