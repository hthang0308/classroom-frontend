import {
  createStyles,
  Image,
  Container,
  Title,
  Text,
  List,
  ThemeIcon,
} from '@mantine/core';
import { IconCheck } from '@tabler/icons';

// import im`age from './image.svg';
import learningHero from '@/assets/learning_hero.svg';

const useStyles = createStyles((theme) => ({
  inner: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: theme.spacing.xl * 4,
    paddingBottom: theme.spacing.xl * 4,
  },

  content: {
    maxWidth: 480,
    marginRight: theme.spacing.xl * 3,

    [theme.fn.smallerThan('md')]: {
      maxWidth: '100%',
      marginRight: 0,
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: 44,
    lineHeight: 1.2,
    fontWeight: 900,

    [theme.fn.smallerThan('xs')]: { fontSize: 28 },
  },

  image: {
    flex: 1,

    [theme.fn.smallerThan('md')]: { display: 'none' },
  },

  highlight: {
    position: 'relative',
    backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
    borderRadius: theme.radius.sm,
    padding: '4px 12px',
  },
}));

export default function HeroBullets() {
  const { classes } = useStyles();

  return (
    <div>
      <Container>
        <div className={classes.inner}>
          <div className={classes.content}>
            <Title className={classes.title}>
              A modern
              {' '}
              <span className={classes.highlight}>Classroom</span>
              {' '}
            </Title>
            <Text color="dimmed" mt="md">
              Some subtext to hype the product up
            </Text>

            <List
              mt={30}
              spacing="sm"
              size="sm"
              icon={(
                <ThemeIcon size={20} radius="xl">
                  <IconCheck size={12} stroke={1.5} />
                </ThemeIcon>
              )}
            >
              <List.Item>
                <b>Benefit 1</b>
                {' '}
                - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod accusantium commodi unde aspernatur quas
              </List.Item>
              <List.Item>
                <b>Benefit 2</b>
                {' '}
                - Lorem ipsum dolor sit amet consectetur adipisicing elit. Lorem ipsum dolor sit amet.
              </List.Item>
              <List.Item>
                <b>Benefit 3</b>
                {' '}
                - Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod accusantium
              </List.Item>
            </List>
          </div>
          <Image src={learningHero} className={classes.image} />
        </div>
      </Container>
    </div>
  );
}
