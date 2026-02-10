/**
 * SearchBar Component Usage Examples
 * 
 * This file demonstrates various ways to use the SearchBar component
 */

import { SearchBar } from "./SearchBar";

// Example 1: Basic Usage
export function BasicSearchBar() {
  const suggestions = ["Apple", "Banana", "Cherry", "Date", "Elderberry"];

  return (
    <SearchBar
      suggestions={suggestions}
      placeholder="Search fruits..."
    />
  );
}

// Example 2: With Search Handler
export function SearchBarWithHandler() {
  const cities = ["New York", "Los Angeles", "Chicago", "Houston"];

  const handleSearch = (query: string) => {
    console.log("User typed:", query);
    // Perform search logic here
  };

  return (
    <SearchBar
      suggestions={cities}
      onSearch={handleSearch}
      placeholder="Search cities..."
    />
  );
}

// Example 3: With Click Action on Suggestions
export function SearchBarWithClickAction() {
  const products = ["iPhone", "iPad", "MacBook", "AirPods"];

  const handleSelectSuggestion = (product: string) => {
    console.log("User selected:", product);
    // Navigate to product page or perform action
    alert(`You selected: ${product}`);
  };

  return (
    <SearchBar
      suggestions={products}
      onSelectSuggestion={handleSelectSuggestion}
      placeholder="Search products..."
    />
  );
}

// Example 4: Full Implementation with State Management
export function FullSearchBarExample() {
  const allItems = [
    "React", "Vue", "Angular", "Svelte", "Next.js", 
    "Nuxt.js", "Gatsby", "Remix"
  ];

  const handleSearch = (query: string) => {
    // Filter items based on query
    console.log("Searching for:", query);
  };

  const handleSelect = (framework: string) => {
    // Handle selection
    console.log("Selected framework:", framework);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Search Frameworks</h2>
      <SearchBar
        suggestions={allItems}
        onSearch={handleSearch}
        onSelectSuggestion={handleSelect}
        placeholder="Type to search frameworks..."
        className="mb-4"
      />
    </div>
  );
}

// Example 5: Dynamic Suggestions (API-based)
export function DynamicSearchBar() {
  // In a real app, you might fetch suggestions from an API
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Simulate API call
    const results = await fetchSuggestionsFromAPI(query);
    setSuggestions(results);
  };

  return (
    <SearchBar
      suggestions={suggestions}
      onSearch={handleSearch}
      onSelectSuggestion={(item) => console.log("Selected:", item)}
      placeholder="Search with dynamic suggestions..."
    />
  );
}

// Mock API function
async function fetchSuggestionsFromAPI(query: string): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data
  const mockData = [
    "JavaScript", "TypeScript", "Python", "Java", "C++",
    "Ruby", "Go", "Rust", "Swift", "Kotlin"
  ];
  
  return mockData.filter(item => 
    item.toLowerCase().includes(query.toLowerCase())
  );
}

import { useState } from "react";
