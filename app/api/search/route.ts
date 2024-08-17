import { NextResponse } from "next/server";
import { semanticSearch } from "@/pythonParsing/semanticSearch";

export async function POST(request: Request) {
  try {
    const { query, limit } = await request.json();
    const results = await semanticSearch(query, limit);
    return NextResponse.json(results);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
