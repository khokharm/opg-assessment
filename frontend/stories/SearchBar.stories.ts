import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { SearchBar } from "../components/SearchBar";

const meta = {
  title: "Components/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placeholder: {
      control: "text",
      description: "Placeholder text for the search input",
    },
    suggestions: {
      control: "object",
      description: "Array of suggestion strings",
    },
  },
  args: {
    onSearch: fn(),
    onSelectSuggestion: fn(),
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const citySuggestions = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Austin",
  "Jacksonville",
  "Fort Worth",
  "Columbus",
  "Charlotte",
  "San Francisco",
  "Indianapolis",
  "Seattle",
  "Denver",
  "Boston",
];

export const Default: Story = {
  args: {
    suggestions: citySuggestions,
    placeholder: "Search for a city...",
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    suggestions: ["Apple", "Banana", "Cherry", "Date", "Elderberry", "Fig"],
    placeholder: "Type to search fruits...",
  },
};

export const LargeSuggestionList: Story = {
  args: {
    suggestions: [
      ...citySuggestions,
      "Miami",
      "Nashville",
      "Portland",
      "Las Vegas",
      "Detroit",
      "Memphis",
      "Baltimore",
      "Milwaukee",
      "Albuquerque",
      "Tucson",
      "Fresno",
      "Sacramento",
      "Kansas City",
      "Mesa",
      "Atlanta",
      "Omaha",
      "Colorado Springs",
      "Raleigh",
      "Virginia Beach",
      "Long Beach",
    ],
    placeholder: "Search cities...",
  },
};

export const EmptySuggestions: Story = {
  args: {
    suggestions: [],
    placeholder: "No suggestions available...",
  },
};

export const InteractiveTest: Story = {
  args: {
    suggestions: citySuggestions,
    placeholder: "Search for a city...",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText("Search for a city...");

    // Type into the search bar
    await userEvent.type(searchInput, "San");

    // Wait a bit for suggestions to appear
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Verify suggestions are filtered
    const suggestions = canvas.getAllByRole("listitem");
    expect(suggestions.length).toBeGreaterThan(0);

    // Click on a suggestion
    await userEvent.click(suggestions[0]);

    // Verify onSelectSuggestion was called
    expect(args.onSelectSuggestion).toHaveBeenCalled();
  },
};

export const KeyboardNavigation: Story = {
  args: {
    suggestions: ["Apple", "Apricot", "Avocado", "Banana", "Blueberry"],
    placeholder: "Try keyboard navigation...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText(
      "Try keyboard navigation..."
    );

    // Focus and type
    await userEvent.click(searchInput);
    await userEvent.type(searchInput, "A");

    // Wait for suggestions
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Press ArrowDown to navigate
    await userEvent.keyboard("{ArrowDown}");
    await userEvent.keyboard("{ArrowDown}");

    // Press Enter to select
    await userEvent.keyboard("{Enter}");

    // Verify the input value changed
    expect(searchInput).toHaveValue(expect.stringMatching(/^A/));
  },
};

export const ClearButton: Story = {
  args: {
    suggestions: citySuggestions,
    placeholder: "Type and clear...",
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText("Type and clear...");

    // Type into the search bar
    await userEvent.type(searchInput, "New York");

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Find and click the clear button
    const clearButton = canvas.getByRole("button");
    await userEvent.click(clearButton);

    // Verify input is cleared
    expect(searchInput).toHaveValue("");
    expect(args.onSearch).toHaveBeenCalledWith("");
  },
};
