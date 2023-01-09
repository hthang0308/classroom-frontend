import {
  Group, Box, Button, Tooltip, TextInput, Center, Text, ActionIcon, createStyles, Textarea,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconPlus, IconGripVertical, IconX } from '@tabler/icons';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';

import { FormProps } from './types';

import StrictModeDroppable from '@/pages/common/strictModeDroppable';

import { SlideTypes } from '@/utils/constants';

interface Props {
  form: UseFormReturnType<FormProps>
}

export const useStyles = createStyles((theme) => ({
  inputLabel: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 8,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.dark[8],
  },
}));

const MultipleChoiceSlideContentSetting = ({ form }: Props) => {
  const { classes } = useStyles();

  const handleAddOption = () => {
    form.insertListItem('options', {
      value: '',
      quantity: 0,
    });
  };

  const handleRemoveOption = (index: number) => {
    form.removeListItem('options', index);
  };

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
      </Box>
    </Box>
  );
};

const HeadingSlideContentSetting = ({ form }: Props) => {
  const { classes } = useStyles();

  return (
    <Box>
      <TextInput
        label="Heading"
        placeholder="Your heading here"
        classNames={{ label: classes.inputLabel }}
        {...form.getInputProps('heading')}
      />
      <Textarea
        label="Subheading"
        placeholder="Your subheading here"
        classNames={{ label: classes.inputLabel }}
        my="md"
        autosize
        minRows={3}
        {...form.getInputProps('subheading')}
      />
    </Box>
  );
};

const ParagraphSlideContentSetting = ({ form }: Props) => {
  const { classes } = useStyles();

  return (
    <Box>
      <TextInput
        label="Heading"
        placeholder="Your heading here"
        classNames={{ label: classes.inputLabel }}
        {...form.getInputProps('heading')}
      />
      <Textarea
        label="Paragraph"
        placeholder="Your paragraph here"
        classNames={{ label: classes.inputLabel }}
        my="md"
        autosize
        minRows={3}
        {...form.getInputProps('paragraph')}
      />
    </Box>
  );
};

export default function SlideContentSetting({ slideType, ...props }: Props & { slideType: string | null }) {
  switch (slideType) {
    case SlideTypes.multipleChoice: {
      return <MultipleChoiceSlideContentSetting {...props} />;
    }

    case SlideTypes.heading: {
      return <HeadingSlideContentSetting {...props} />;
    }

    case SlideTypes.paragraph: {
      return <ParagraphSlideContentSetting {...props} />;
    }

    default: {
      return null;
    }
  }
}
