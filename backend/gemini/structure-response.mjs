import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const ai = new GoogleGenAI({});

async function run() {
  const prompt =
    "The new UI is incredibly intuitive and visually appealing. Great job! Add a very long summary to test streaming!";

  const matchSchema = z.object({
    title: z.string().describe("Title of the News."),
    description: z.string().describe("Description of the News."),
  });

  const stream = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: "Generate a news article about the latest technology trends.",
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(matchSchema),
      tools: {
        googleSearch: {},
      },
    },
  });

  for await (const chunk of stream) {
    console.log(chunk.candidates[0].content.parts[0].text);
  }
}

run();
