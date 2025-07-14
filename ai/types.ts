import { InferUITools, ToolSet, UIMessage } from "ai";
import z from "zod";

const metadataSchema = z.object({});

type MyMetadata = z.infer<typeof metadataSchema>;

const dataPartSchema = z.object({
  weather: z.object({
    location: z.string().optional(),
    temperature: z.number().optional(),
    humidity: z.number().optional(),
    windSpeed: z.number().optional(),
    description: z.string().optional(),
  }),
});

type MyDataPart = z.infer<typeof dataPartSchema>;

const tools: ToolSet = {};

type MyTools = InferUITools<typeof tools>;

export type MyUIMessage = UIMessage<MyMetadata, MyDataPart, MyTools>;
