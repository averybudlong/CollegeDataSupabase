import { generateEmbeddings } from "../../pythonParsing/embeddings";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await generateEmbeddings();
      res.status(200).json({ message: "Embeddings generated successfully" });
    } catch (error) {
      console.error("Error generating embeddings:", error);
      res.status(500).json({ error: "Failed to generate embeddings" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
