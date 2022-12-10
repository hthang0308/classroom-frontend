import {
  Container, Group, Box, Button, Breadcrumbs, Anchor, Grid, Tooltip, SegmentedControl,
  Select, TextInput, Divider, Center, Text, createStyles, ActionIcon, Stack,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconPlus, IconGripVertical, IconX, IconDeviceFloppy, IconPresentationAnalytics,
  IconChartBar, IconChartDonut, IconChartPie, IconGrain,
} from '@tabler/icons';
import { useState, useEffect } from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useParams, Link } from 'react-router-dom';

import { FAKE_DATA, PresentationType } from '../list';
import MultipleChoiceSlideTemplate from '../slideTemplate/multipleChoice';

import StrictModeDroppable from '@/pages/common/strictModeDroppable';

import { SLIDE_TYPE, CHART_TYPE } from '@/utils/constants';

// const FAKE_SLIDES_DATA = [
//   {
//     id: '1',
//     type: 'mutilple choice',
//     question: 'Question 01',
//     options: [
//       'Chocolate',
//       'Cupcake',
//       'Candy',
//     ],
//   },
//   {
//     id: '2',
//     type: 'mutilple choice',
//     question: 'Question 02',
//     options: [
//       'Chocolate',
//       'Cupcake',
//       'Candy',
//     ],
//   },
//   {
//     id: '3',
//     type: 'mutilple choice',
//     question: 'Question 03',
//     options: [
//       'Chocolate',
//       'Cupcake',
//       'Candy',
//     ],
//   },
// ];

// interface Slide {
//   id: string
//   type: string
//   question: string
//   options: string[]
// }

const useStyles = createStyles((theme) => ({
  inputLabel: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[8],
  },
}));

const SlideContentSetting = ({ slideType }: { slideType: string | null }) => {
  const { classes } = useStyles();
  const [chartType, setChartType] = useState<string>(CHART_TYPE.BARS_CHART);

  const form = useForm({
    initialValues: {
      question: '',
      options: ['', '', ''],
    },
  });

  const handleAddOption = () => {
    form.insertListItem('options', '');
  };

  const handleRemoveOption = (index: number) => {
    form.removeListItem('options', index);
  };

  const segmentedData = [
    {
      value: CHART_TYPE.BARS_CHART,
      label: (
        <Center>
          <IconChartBar size={16} />
          <Box ml={10}>Bars</Box>
        </Center>
      ),
    },
    {
      value: CHART_TYPE.DONUT_CHART,
      label: (
        <Center>
          <IconChartDonut size={16} />
          <Box ml={10}>Donut</Box>
        </Center>
      ),
    },
    {
      value: CHART_TYPE.PIE_CHART,
      label: (
        <Center>
          <IconChartPie size={16} />
          <Box ml={10}>Pie</Box>
        </Center>
      ),
    },
    {
      value: CHART_TYPE.DOTS_CHART,
      label: (
        <Center>
          <IconGrain size={16} />
          <Box ml={10}>Dots</Box>
        </Center>
      ),
    },
  ];

  console.log(slideType);

  const fields = form.values.options.map((_, index) => (
    <Draggable key={index.toString()} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group ref={provided.innerRef} mt="xs" {...provided.draggableProps} spacing="xs">
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={18} />
          </Center>
          <TextInput
            placeholder={`Option ${index + 1}`}
            styles={() => ({ root: { flexGrow: 2 } })}
            {...form.getInputProps(`options.${index}`)}
          />
          <Tooltip label="Remove">
            <ActionIcon onClick={() => handleRemoveOption(index)}><IconX /></ActionIcon>
          </Tooltip>
        </Group>
      )}
    </Draggable>
  ));

  return (
    <Box>
      <TextInput
        label="Your question"
        placeholder="Your question here"
        classNames={{ label: classes.inputLabel }}
        {...form.getInputProps('question')}
      />
      <Box my="md">
        <Text className={classes.inputLabel}>Options</Text>
        <DragDropContext
          onDragEnd={
            ({ destination, source }) => form.reorderListItem('options', { from: source.index, to: destination?.index || 0 })
          }
        >
          <StrictModeDroppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {fields}
                {provided.placeholder}
              </div>
            )}
          </StrictModeDroppable>
        </DragDropContext>

        <Group position="center" mt="md">
          <Button
            onClick={handleAddOption}
            leftIcon={<IconPlus />}
            variant="light"
            w="100%"
          >
            Add option
          </Button>
        </Group>
        <Stack mt="md" spacing="xs">
          <Text className={classes.inputLabel}>Result Layout</Text>
          <SegmentedControl
            data={segmentedData}
            value={chartType}
            onChange={setChartType}
          />
        </Stack>
      </Box>
    </Box>
  );
};

export default function EditPresentation() {
  const [presentationData, setPresentationData] = useState<PresentationType>();
  const [slideType, setSlideType] = useState<string | null>(SLIDE_TYPE.MULTIPLE_CHOICE);
  const { presentationId } = useParams();
  const { classes } = useStyles();

  useEffect(() => {
    const data = FAKE_DATA.find((i) => i.id === presentationId);

    setPresentationData(data);
  }, [presentationId]);

  const breadcrumbsItems = [
    { title: 'My presentations', to: '/presentations' },
    { title: presentationData?.name || '', to: '#' },
  ];

  const slideTypeOptions = [
    { value: SLIDE_TYPE.MULTIPLE_CHOICE, label: 'Multiple Choice' },
    // { value: SLIDE_TYPE.HEADING, label: 'Heading' },
    // { value: SLIDE_TYPE.PARAGRAPH, label: 'Paragraph' },
  ];

  return (
    <Container fluid>
      <Group position="apart">
        <Breadcrumbs>
          {breadcrumbsItems.map((item, index) => (
            <Anchor key={index} component={Link} to={item.to}>
              {item.title}
            </Anchor>
          ))}
        </Breadcrumbs>
        <Group spacing="xs">
          <Button leftIcon={<IconPlus />} variant="outline">
            <Text>New slide</Text>
          </Button>
          <Button leftIcon={<IconDeviceFloppy />} variant="outline">
            <Text>Save</Text>
          </Button>
          <Button leftIcon={<IconPresentationAnalytics />}>
            <Text>Present</Text>
          </Button>
        </Group>
      </Group>
      <Grid my="md" gutter="md">
        <Grid.Col span={1}>
          Slides preview
        </Grid.Col>
        <Grid.Col span={8}>
          <MultipleChoiceSlideTemplate />
        </Grid.Col>
        <Grid.Col span={3} p={16}>
          <Select
            label="Slide type"
            data={slideTypeOptions}
            value={slideType}
            onChange={setSlideType}
            classNames={{ label: classes.inputLabel }}
          />
          <Divider my="md" />
          <SlideContentSetting slideType={slideType} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
