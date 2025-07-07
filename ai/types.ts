import { UIMessage, UITools } from "ai";
import z from "zod";

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

export type MyUIMessage = UIMessage<never, MyDataPart, UITools>;
