import { NavLink } from '@mantine/core';
import { IconChartBar, IconHeading, IconColumns, IconAlertTriangle } from '@tabler/icons';
import { Link } from 'react-router-dom';

import { SlideInfo } from './types';

import { SlideTypes } from '@/utils/constants';

interface Props {
  slideList: SlideInfo[]
  currentSlideId?: string
}

export default function SlideListNavigation({ slideList, currentSlideId = '' }: Props) {
  return (
    <>
      {
        slideList.map((i) => {
          let Icon;

          switch (i.type) {
            case SlideTypes.multipleChoice: {
              Icon = IconChartBar;
              break;
            }

            case SlideTypes.heading: {
              Icon = IconHeading;
              break;
            }

            case SlideTypes.paragraph: {
              Icon = IconColumns;
              break;
            }

            default: {
              Icon = IconAlertTriangle;
            }
          }

          return (
            <NavLink
              key={i.id}
              label={i.label}
              description={i.title}
              active={i.id === currentSlideId}
              variant="filled"
              icon={<Icon />}
              component={Link}
              to={i.id === currentSlideId ? '#' : i.url}
            />
          );
        })
      }
    </>
  );
}
