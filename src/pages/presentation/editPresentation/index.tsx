import {
  Container, Group, Box, Button, Breadcrumbs, Anchor, Grid, Tooltip, SegmentedControl,
  Select, TextInput, Divider, Center, Text, createStyles, ActionIcon, Stack,
} from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import {
  IconPlus, IconGripVertical, IconX, IconDeviceFloppy, IconPresentationAnalytics,
  IconChartBar, IconChartDonut, IconChartPie, IconGrain,
} from '@tabler/icons';
import {
  useState, useEffect, useCallback,
} from 'react';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { useParams, Link } from 'react-router-dom';

import MultipleChoiceSlideTemplate from '../slideTemplate/multipleChoice';

import presentationApi, {
  PresentationWithUserCreated as PresentationType,
  CompactSlide as SlideType,
} from '@/api/presentation';
import * as notificationManager from '@/pages/common/notificationManager';
import StrictModeDroppable from '@/pages/common/strictModeDroppable';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { SLIDE_TYPE, CHART_TYPE } from '@/utils/constants';

interface FormProps {
  question: string
  options: {
    value: string
    quantity: number
  }[]
}

interface Props {
  slideInfo: SlideType | undefined
  form: UseFormReturnType<FormProps>
}

const useStyles = createStyles((theme) => ({
  inputLabel: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[8],
  },
}));

const MultipleChoiceSlideContentSetting = ({ slideInfo, form }: Props) => {
  const { classes } = useStyles();
  const [chartType, setChartType] = useState<string>(CHART_TYPE.BARS_CHART);

  useEffect(() => {
    if (slideInfo?.title) {
      form.setFieldValue('question', slideInfo?.title !== 'New Slide' ? slideInfo?.title : '');
    }

    if (slideInfo && slideInfo?.options.length !== 0) {
      form.setFieldValue('options', slideInfo.options.map((i) => ({
        ...i,
        quantity: i.quantity || 0,
      })));
    } else {
      form.setFieldValue('options', [{ value: '', quantity: 0 }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideInfo]);

  const handleAddOption = () => {
    form.insertListItem('options', {
      value: '',
      quantity: 0,
    });
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

  const fields = form.values.options.map((_, index) => (
    <Draggable key={index} index={index} draggableId={index.toString()}>
      {(provided) => (
        <Group ref={provided.innerRef} mt="xs" {...provided.draggableProps} spacing="xs">
          <Center {...provided.dragHandleProps}>
            <IconGripVertical size={18} />
          </Center>
          <TextInput
            placeholder={`Option ${index + 1}`}
            styles={() => ({ root: { flexGrow: 2 } })}
            {...form.getInputProps(`options.${index}.value`)}
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
  const [slideData, setSlideData] = useState<SlideType>();
  const [slideType, setSlideType] = useState<string | null>(null);
  const { presentationId, slideId } = useParams();
  const { classes } = useStyles();

  const form = useForm<FormProps>({
    initialValues: {
      question: '',
      options: [
        {
          value: '',
          quantity: 0,
        },
      ],
    },
  });

  const fetchData = useCallback(async () => {
    try {
      const { data: response } = await presentationApi.getPresentationById(presentationId);

      const currentSlideData = response.data.slides.find((i) => i._id === slideId);

      setPresentationData(response.data);
      setSlideData(currentSlideData);
      setSlideType(currentSlideData?.slideType || null);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  }, [presentationId, slideId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const breadcrumbsItems = [
    { title: 'My presentations', to: '/presentations' },
    { title: presentationData?.name || '', to: '#' },
  ];

  const slideTypeOptions = [
    { value: SLIDE_TYPE.MULTIPLE_CHOICE, label: 'Multiple Choice' },
    // { value: SLIDE_TYPE.HEADING, label: 'Heading' },
    // { value: SLIDE_TYPE.PARAGRAPH, label: 'Paragraph' },
  ];

  const handleSave = async () => {
    try {
      const { data: response } = await presentationApi.updateMultipleChoiceSlide(slideId, {
        question: form.values.question,
        options: form.values.options,
      });

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

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
          <Button leftIcon={<IconDeviceFloppy />} variant="outline" onClick={handleSave}>
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
          <MultipleChoiceSlideContentSetting slideInfo={slideData} form={form} />
        </Grid.Col>
      </Grid>
    </Container>
  );
}
