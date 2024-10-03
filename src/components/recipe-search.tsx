"use client"; // Enables client-side rendering for this component

import React, { useState, FormEvent } from "react"; // Import useState and FormEvent from React
import { Input } from "@/components/ui/input"; // Import custom Input component
import { Button } from "@/components/ui/button"; // Import custom Button component
import { Card, CardContent } from "@/components/ui/card"; // Import custom Card components
import Link from "next/link"; // Import Link component from Next.js
import { SearchIcon } from "lucide-react"; // Import SearchIcon from lucide-react
import ClipLoader from "react-spinners/ClipLoader";
import Image from "next/image"; // Import Next.js Image component

// Define the Recipe interface
interface Recipe {
  uri: string;
  label: string;
  image: string;
  ingredientLines: string[];
  ingredients: { text: string }[];
  url: string;
}

// Example search terms
const examples = [
  "Biryani",
  "Chicken Karahi",
  "Nihari",
  "Haleem",
  "Chapli Kabab",
];

export default function RecipeSearch() {
  // State to manage the search query
  const [query, setQuery] = useState<string>("");
  // State to manage the list of fetched recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // State to manage the loading state during the API fetch
  const [loading, setLoading] = useState<boolean>(false);
  // State to manage if a search has been performed
  const [searched, setSearched] = useState<boolean>(false);

  // Function to handle the search form submission
  const handleSearch = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setSearched(true);
    setRecipes([]); // Clear previous recipes
    try {
      const response = await fetch(
        `https://api.edamam.com/search?q=${query}&app_id=${process.env.NEXT_PUBLIC_EDAMAM_APP_ID}&app_key=${process.env.NEXT_PUBLIC_EDAMAM_APP_KEY}`
      );
      const data = await response.json();
      setRecipes(data.hits.map((hit: { recipe: Recipe }) => hit.recipe));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  // JSX return statement rendering the Recipe Search UI
  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 md:p-6 bg-[#f8f5f0] text-[#333]">
  {/* Header section */}
  <header className="flex flex-col items-center mb-8">
    <h1 className="text-4xl font-bold text-[#0e6251] mb-4">Recipe Search</h1>
    <p className="text-lg mb-6">Find delicious recipes by ingredients you have at home.</p>
    {/* Example search terms */}
    <div className="mb-6">
      <p className="text-gray-600 mb-2">Try searching for:</p>
      <div className="flex space-x-2">
        {examples.map((example) => (
          <span
            key={example}
            className="px-3 py-2 bg-[#d4af37] rounded-md cursor-pointer text-[#0e6251] hover:bg-[#e2c275] transition-colors duration-300"
            onClick={() => setQuery(example)}
          >
            {example}
          </span>
        ))}
      </div>
    </div>
    {/* Search form */}
    <form className="relative w-full max-w-md mb-8" onSubmit={handleSearch}>
      <Input
        type="search"
        placeholder="Search by ingredient..."
        className="pr-10 bg-[#f8f5f0] border-2 border-[#bdc3c7] text-[#333] placeholder-gray-600 rounded-md focus:border-[#0e6251] focus:ring-2 focus:ring-[#d4af37]"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#0e6251] hover:text-[#d4af37] transition-colors"
      >
        <SearchIcon className="w-5 h-5" />
      </Button>
    </form>
  </header>
  
  {/* Loading spinner */}
  {loading ? (
    <div className="flex flex-col justify-center items-center w-full h-full text-[#0e6251]">
      <ClipLoader className="w-12 h-12 mb-4" />
      <p>Loading recipes, please wait...</p>
    </div>
  ) : (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Message for no recipes found */}
      {searched && recipes.length === 0 && (
        <p className="text-center text-[#0e6251]">No recipes found. Try searching with different ingredients.</p>
      )}
      {/* Display list of recipes */}
      {recipes.map((recipe) => (
        <Card className="group relative bg-[#fff9f4] text-[#333] rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <Image
            src={recipe.image}
            alt={recipe.label}
            width={400}
            height={300}
            className="rounded-t-lg object-cover w-full h-48 group-hover:opacity-75 transition-opacity"
          />
          <CardContent className="p-4">
            <h2 className="text-2xl font-semibold mb-2 text-[#0e6251]">{recipe.label}</h2>
            <p className="text-gray-600 line-clamp-2">{recipe.ingredientLines.join(", ")}</p>
          </CardContent>
          <Link
            href={recipe.url}
            className="absolute inset-0 z-10"
            prefetch={false}
          >
            <span className="sr-only">View recipe</span>
          </Link>
        </Card>
      ))}
    </div>
  )}
</div>

  );
}
