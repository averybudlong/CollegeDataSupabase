"use client";

import React, { useState } from "react";

interface SearchResult {
  id: number;
  name: string;
  description: string;
  similarity: number;
}

export default function SearchComponent() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, limit: 5 }),
      });
      if (!response.ok) {
        throw new Error("Search request failed");
      }
      const data: SearchResult[] = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error performing search:", error);
      // You might want to set an error state here and display it to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setQuery(e.target.value)
          }
          placeholder="Enter your search query"
          className="w-full p-2 border border-gray-300 rounded text-black"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </form>
      <div>
        {results.map((result) => (
          <div
            key={result.id}
            className="mb-4 p-4 border border-gray-200 rounded"
          >
            <p>{result.name}</p>
            <p>{result.description}</p>
            <p className="text-sm text-gray-500">
              Similarity: {result.similarity.toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
