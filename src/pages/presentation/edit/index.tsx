import {
  Container, Group, Button, Breadcrumbs, Anchor, Grid, Loader, Select, Divider, Center, Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconPlus, IconDeviceFloppy, IconPresentationAnalytics, IconTrash,
} from '@tabler/icons';
import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import SlideContentSetting, { useStyles } from './slideContentSetting';
import SlideListNavigation from './slideListNavigation';
import SlidePreview from './slidePreview';
import { SlideInfo, FormProps } from './types';

import presentationApi, {
  PresentationWithUserInfo as Presentation,
  CompactSlide,
  Slide,
} from '@/api/presentation';
import { BaseResponse } from '@/api/types';
import * as notificationManager from '@/pages/common/notificationManager';
import { isAxiosError, ErrorResponse } from '@/utils/axiosErrorHandler';
import { SlideTypes } from '@/utils/constants';

export default function EditPresentation() {
  const [presentationData, setPresentationData] = useState<Presentation>();
  const [slideData, setSlideData] = useState<CompactSlide>();
  const [slideType, setSlideType] = useState<string | null>(null);
  const [slideList, setSlideList] = useState<SlideInfo[]>([]);
  const [isLoading, setLoading] = useState(false);
  const { presentationId, slideId } = useParams();
  const { classes } = useStyles();
  const navigate = useNavigate();

  const form = useForm<FormProps>({
    initialValues: {
      question: '',
      options: [
        {
          value: '',
          quantity: 0,
        },
      ],
      heading: '',
      subheading: '',
      paragraph: '',
    },
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: response } = await presentationApi.getPresentationById(presentationId);

      setPresentationData(response.data);
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }

    setLoading(false);
  }, [presentationId]);

  useEffect(() => {
    if (presentationData) {
      const currentSlideData = presentationData.slides.find((i) => i._id === slideId);
      const slideListData = presentationData.slides.map((i, index) => ({
        id: i._id,
        label: `Slide ${index + 1}`,
        title: i.title,
        url: `/presentation/${presentationId}/${i._id}/edit`,
        type: i.slideType,
      }));

      setSlideData(currentSlideData);
      setSlideType(currentSlideData?.slideType || null);
      setSlideList(slideListData);
    }
  }, [presentationData, presentationId, slideId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const breadcrumbsItems = [
    { title: 'My presentations', to: '/presentations' },
    { title: presentationData?.name || '', to: '#' },
  ];

  const slideTypeOptions = [
    { value: SlideTypes.multipleChoice, label: 'Multiple Choice' },
    { value: SlideTypes.heading, label: 'Heading' },
    { value: SlideTypes.paragraph, label: 'Paragraph' },
  ];

  const handleSlideTypeChange = (type: string) => {
    setSlideData((prevState) => ({
      _id: prevState?._id || '',
      slideType: prevState?.slideType || SlideTypes.multipleChoice,
      title: prevState?.title || '',
      content: '',
      options: [],
    }));
    setSlideType(type);
  };

  const handleCreateNewSlide = async () => {
    try {
      const { data: response } = await presentationApi.createSlide(presentationId);

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleSave = async () => {
    try {
      const response = {} as BaseResponse<Slide>;

      if (slideType === SlideTypes.multipleChoice) {
        const { data: res } = await presentationApi.updateMultipleChoiceSlide(slideId, {
          question: form.values.question,
          options: form.values.options.filter((i) => i.value),
        });

        Object.assign(response, res);
      } else if (slideType === SlideTypes.heading) {
        const { data: res } = await presentationApi.updateHeadingParagraphSlide(slideId, {
          title: form.values.heading,
          content: form.values.subheading,
          type: SlideTypes.heading,
        });

        Object.assign(response, res);
      } else {
        const { data: res } = await presentationApi.updateHeadingParagraphSlide(slideId, {
          title: form.values.heading,
          content: form.values.paragraph,
          type: SlideTypes.paragraph,
        });

        Object.assign(response, res);
      }

      notificationManager.showSuccess('', response.message);
      fetchData();
    } catch (error) {
      if (isAxiosError<ErrorResponse>(error)) {
        notificationManager.showFail('', error.response?.data.message);
      }
    }
  };

  const handleDeleteSlide = async () => {
    try {
      const { data: response } = await presentationApi.deleteSlide(slideId);
      const randomSlide = slideList.find((i) => i.id !== slideId);

      notificationManager.showSuccess('', response.message);
      navigate(`/presentation/${presentationId}/${randomSlide?.id}/edit`);
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
          <Button leftIcon={<IconPlus />} variant="outline" onClick={handleCreateNewSlide}>
            <Text>New slide</Text>
          </Button>
          <Button leftIcon={<IconDeviceFloppy />} variant="outline" onClick={handleSave}>
            <Text>Save</Text>
          </Button>
          <Link to={`/presentation/active/${presentationId}`}>
            <Button leftIcon={<IconPresentationAnalytics />}>
              <Text>Present</Text>
            </Button>
          </Link>
        </Group>
      </Group>

      <Grid my="md" gutter="md">
        <Grid.Col span={2}>
          <SlideListNavigation currentSlideId={slideId} slideList={slideList} />
        </Grid.Col>
        <Grid.Col span={10}>
          {
            isLoading
              ? (
                <Center>
                  <Loader />
                </Center>
              )
              : (
                <Grid>
                  <Grid.Col span={8}>
                    <SlidePreview type={slideType} slideData={slideData} />
                  </Grid.Col>
                  <Grid.Col span={4} p={16}>
                    <Select
                      label="Slide type"
                      data={slideTypeOptions}
                      value={slideType}
                      onChange={handleSlideTypeChange}
                      classNames={{ label: classes.inputLabel }}
                    />
                    <Divider my="md" />
                    <SlideContentSetting
                      slideInfo={slideData}
                      form={form}
                      slideType={slideType}
                    />
                    <Divider my="xl" />
                    <Group position="center" mt="xl">
                      <Button
                        color="red"
                        leftIcon={<IconTrash />}
                        onClick={handleDeleteSlide}
                        disabled={slideList.length === 1}
                      >
                        Delete slide
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              )
          }
        </Grid.Col>
      </Grid>
    </Container>
  );
}
