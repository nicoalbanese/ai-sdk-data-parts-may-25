import { MyUIMessage } from "@/ai/types";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  tool,
} from "ai";
import { z } from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = createUIMessageStream<MyUIMessage>({
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
            inputSchema: z.object({}),
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
                  description: Math.random() > 0.5 ? "Sunny" : "Cloudy",
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
