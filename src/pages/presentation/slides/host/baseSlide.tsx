import { AspectRatio } from '@mantine/core';
import { useRef, useEffect, useState } from 'react';

import { useWindowDimensions } from '@/pages/presentation/hooks';

const BaseSlide = ({ children }: { children: React.ReactNode }) => {
  const [slideDisplayHeight, setSlideDisplayHeight] = useState<number>(0);
  const { height } = useWindowDimensions();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSlideDisplayHeight(height - (containerRef.current?.offsetTop || 0) - 48);
  }, [height]);

  return (
    <AspectRatio
      ratio={16 / 9}
      h={slideDisplayHeight}
      sx={(theme) => ({
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.gray[5] : 'white',
      })}
      ref={containerRef}
    >
      {children}
    </AspectRatio>
  );
};

export default BaseSlide;
