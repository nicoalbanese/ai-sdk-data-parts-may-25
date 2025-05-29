import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream({
    onError: (error) => {
      if (error instanceof Error) {
        return error.message;
      }
      console.error(error);
      return "An unknown error occurred.";
    },
    execute: ({ writer }) => {
      const result = streamText({
        model: openai("gpt-4o"),
        messages: convertToModelMessages(messages),
        onError: (error) => {
          console.error(error);
        },
        toolChoice: { toolName: "weatherTool", type: "tool" },
        tools: {
          weatherTool: tool({
            description: "Get the weather for a location",
            parameters: z.object({}),
            execute: async ({}, { toolCallId: id }) => {
              writer.write({
                type: "data-weather",
                data: {
                  location: "New York",
                  temperature: Math.floor(Math.random() * 100),
                },
                id,
              });
              await new Promise((resolve) => setTimeout(resolve, 2000));
              writer.write({
                type: "data-weather",
                data: {
                  humidity: Math.floor(Math.random() * 100),
                },
                id,
              });
              await new Promise((resolve) => setTimeout(resolve, 2000));
              writer.write({
                type: "data-weather",
                data: {
                  windSpeed: Math.floor(Math.random() * 100),
                },
                id,
              });
              await new Promise((resolve) => setTimeout(resolve, 2000));
              writer.write({
                type: "data-weather",
                data: {
                  weatherDescription: Math.random() > 0.5 ? "Sunny" : "Cloudy",
                },
                id,
              });
              return "Successful call";
            },
          }),
        },
      });
      writer.merge(result.toUIMessageStream());
    },
  });

  return createUIMessageStreamResponse({ stream });
}
