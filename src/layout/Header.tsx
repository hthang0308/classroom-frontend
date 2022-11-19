import {
  createStyles,
  Header,
  Group,
  Button,
  Divider,
  Box,
  Burger,
  Drawer,
  Image,
  ScrollArea, useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { Link } from 'react-router-dom';

import BlackLogo from '@/assets/logo-low-res-black.png';
import WhiteLogo from '@/assets/logo-low-res-white.png';

import ThemeSwitcher from '@/components/buttons/ThemeSwitcher';
import useUserInfo from '@/hooks/useUserInfo';

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

const NavLinks = () => {
  const { classes } = useStyles();

  return (
    <Link to="/groups" className={classes.link}>
      Groups
    </Link>
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
            <Link to="/user/me">
              <Button variant="default">
                {userInfo.name}
              </Button>
            </Link>
          )
          : (
            <>
              <Link to="/login">
                <Button variant="default">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )
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
