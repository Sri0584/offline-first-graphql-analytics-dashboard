import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-essentials', '@storybook/addon-interactions'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
};

export default config;
