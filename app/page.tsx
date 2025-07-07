"use client";

import { MyUIMessage } from "@/ai/types";
import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, sendMessage, status } = useChat<MyUIMessage>({});

  const weatherParts = messages
    .flatMap((message) =>
      message.parts.filter((part) => part.type === "data-weather"),
    )
    .at(-1);

  return (
    <div className="flex flex-col w-full max-w-lg overflow-x-hidden py-24 mx-auto stretch">
      <button
        className="bg-zinc-100 px-3 py-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={status !== "ready"}
        onClick={() => sendMessage({ text: "" })}
      >
        Trigger message
      </button>
      {weatherParts && (
        <div className="mt-4 p-4 border border-zinc-100 rounded-lg">
          <pre>{JSON.stringify(weatherParts, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
