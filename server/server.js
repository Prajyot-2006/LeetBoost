import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const complexitySchema = {
  type: Type.OBJECT,

  properties: {

    timeComplexity: {
      type: Type.STRING,
      description:
        "Plain text Big-O time complexity such as O(1), O(N), O(log N), O(N log M), O(N^2). No LaTeX."
    },

    spaceComplexity: {
      type: Type.STRING,
      description:
        "Plain text Big-O total space complexity including output data structures. Examples: O(1), O(N), O(N log M). No LaTeX."
    }

  },

  required: [
    "timeComplexity",
    "spaceComplexity"
  ]
};


app.post("/analyze-complexity", async (req, res) => {

  try {

    const { code } = req.body;

    if (!code) {

      return res.status(400).json({
        error: "No code provided"
      });

    }


    const prompt = `
You are an expert code analysis backend for the LeetBoost browser extension.

Analyze the provided LeetCode solution and determine:

1. Time Complexity
2. Space Complexity

CRITICAL RULES:

- Use PLAIN TEXT Big-O notation only.
- Do NOT use LaTeX.
- Do NOT use markdown.
- Do NOT use backslashes.
- Use formats such as:
  O(1)
  O(N)
  O(log N)
  O(N log M)
  O(N^2)
  O(N * M)

- For Space Complexity, ALWAYS calculate TOTAL SPACE COMPLEXITY INCLUDING OUTPUT DATA STRUCTURES.

Analyze the following code:

${code}
`;


    const response = await ai.models.generateContent({

      model: "gemini-3.5-flash-lite",

      contents: prompt,

      config: {

        responseMimeType: "application/json",

        responseSchema: complexitySchema,

        temperature: 0.1

      }

    });


    const result = JSON.parse(response.text);

    res.json(result);

  }

  catch (error) {

    console.error(
      "Gemini error details:",
      error
    );


    if (
      error.status === 503 ||
      error.status === 429
    ) {

      return res.status(503).json({

        error:
          "Gemini API is temporarily experiencing high demand. Please try again in a few moments."

      });

    }


    res.status(500).json({

      error:
        "Failed to analyze complexity due to an internal server error."

    });

  }

});


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {

  console.log(`LeetBoost AI server running on port ${PORT}`);

});