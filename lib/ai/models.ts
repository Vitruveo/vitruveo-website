export const DEFAULT_CHAT_MODEL: string = "chat-model";

export type ChatModel = {
  id: string;
  name: string;
  description: string;
};

export const chatModels: ChatModel[] = [
  {
    id: "chat-model",
    name: "Anthropic Claude Haiku 5.5",
    description: "Designed for agents, coding, and computer use",
  },
];
