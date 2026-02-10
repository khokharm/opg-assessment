import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WeatherDisplayCard from '../components/WeatherDisplayCard';

const meta = {
  title: 'Components/WeatherDisplayCard',
  component: WeatherDisplayCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    location: { 
      control: 'text',
      description: 'The name of the location/region'
    },
    temperature: { 
      control: 'text',
      description: 'The temperature value with unit'
    },
  },
} satisfies Meta<typeof WeatherDisplayCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    location: 'London',
    temperature: '22°C',
  },
};

export const NewYork: Story = {
  args: {
    location: 'New York',
    temperature: '18°C',
  },
};

export const Tokyo: Story = {
  args: {
    location: 'Tokyo',
    temperature: '25°C',
  },
};

export const Sydney: Story = {
  args: {
    location: 'Sydney',
    temperature: '28°C',
  },
};

export const ColdWeather: Story = {
  args: {
    location: 'Reykjavik',
    temperature: '-5°C',
  },
};

export const HotWeather: Story = {
  args: {
    location: 'Dubai',
    temperature: '45°C',
  },
};
