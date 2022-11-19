import { ColorScheme } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';

export default function useColorScheme() {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mantine-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = () => {
    setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  };

  return {
    colorScheme,
    toggleColorScheme,
  };
}
