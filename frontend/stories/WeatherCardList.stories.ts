import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import WeatherCardList from '../components/WeatherCardList';

const meta = {
  title: 'Components/WeatherCardList',
  component: WeatherCardList,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof WeatherCardList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    weatherData: [
      { location: 'London', temperature: '22°C' },
      { location: 'New York', temperature: '18°C' },
      { location: 'Tokyo', temperature: '25°C' },
    ],
  },
};

export const ManyLocations: Story = {
  args: {
    weatherData: [
      { location: 'London', temperature: '22°C' },
      { location: 'New York', temperature: '18°C' },
      { location: 'Tokyo', temperature: '25°C' },
      { location: 'Sydney', temperature: '28°C' },
      { location: 'Paris', temperature: '20°C' },
      { location: 'Dubai', temperature: '45°C' },
      { location: 'Reykjavik', temperature: '-5°C' },
      { location: 'Mumbai', temperature: '32°C' },
      { location: 'Berlin', temperature: '15°C' },
    ],
  },
};

export const SingleLocation: Story = {
  args: {
    weatherData: [
      { location: 'London', temperature: '22°C' },
    ],
  },
};

export const Empty: Story = {
  args: {
    weatherData: [],
  },
};
