import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

const supabaseClient = createClient(supabaseUrl, supabaseKey);

interface SearchResult {
  id: number;
  name: string;
  description: string;
  similarity: number;
}

async function processQueryWithGPT(query: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant whose job is to process a query about universities that a user provides. " +
          "Take the query and return a list of colleges that match the query separated by commas with NO EXPLANATION",
      },
      {
        role: "user",
        content: `Find the most relevant colleges for this query: "${query}"`,
      },
    ],
    max_tokens: 100,
  });

  return response.choices[0].message.content + ", " + query || query;
}

export async function semanticSearch(
  query: string,
  limit: number = 5
): Promise<SearchResult[]> {
  try {
    const processedQuery = await processQueryWithGPT(query);
    console.log("Processed Query: ", processedQuery);

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: processedQuery,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Perform the search
    const { data, error } = await supabaseClient.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_threshold: 0.0, // Adjust this value to control the similarity threshold
      match_count: limit,
    });

    if (error) {
      console.error("Error performing semantic search:", error);
      throw error;
    }

    return data as SearchResult[];
  } catch (error) {
    console.error("Error in semantic search:", error);
    throw error;
  }
}
