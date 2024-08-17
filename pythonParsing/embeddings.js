import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local in the root directory
dotenv.config({ path: path.resolve(process.cwd(), "../.env.local") });

// Check for OpenAI API key
const openaiApiKey = process.env.OPENAI_API_KEY;
if (!openaiApiKey) {
  throw new Error("Missing OpenAI API Key");
}

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: openaiApiKey });

// Check for Supabase environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

// Initialize Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseKey);

async function getDocuments() {
  const { data, error } = await supabaseClient
    .from("college")
    .select("id, description");

  if (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }

  return data;
}

export default async function generateEmbeddings() {
  console.log("Starting generateEmbeddings function");
  const documents = await getDocuments();

  for (const document of documents) {
    // const { data, error } = await supabaseClient
    //   .from("college")
    //   .select()
    //   .eq("id", document.id);

    // console.log(data);

    const input = document.desc;
    try {
      console.log(`Generating embedding for document id: ${document.id}`);
      const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input,
      });

      const [{ embedding }] = embeddingResponse.data;

      console.log(`Updating database for document id: ${document.id}`);
      console.log(`Embedding: ${embedding}`);
      const { error } = await supabaseClient
        .from("college")
        .update({ embedding: embedding })
        .eq("id", document.id);

      if (error) {
        console.error("Error updating embedding:", error);
      } else {
        console.log(`${document.embedding}`);
        console.log(`Updated embedding for document id: ${document.id}`);
      }
    } catch (error) {
      console.error("Error creating or updating embedding:", error);
    }
  }
  console.log("Finished generateEmbeddings function");
}
