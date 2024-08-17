import generateEmbeddings from "../pythonParsing/embeddings.mjs";

async function main() {
  try {
    await generateEmbeddings();
    console.log("Embeddings generated successfully");
  } catch (error) {
    console.error("Error generating embeddings:", error);
  }
}

main();
