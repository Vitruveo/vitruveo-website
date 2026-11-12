import {
  customProvider,
  gateway,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { isTestEnvironment } from "../constants";

// All AI calls go through Vercel AI Gateway (auth: AI_GATEWAY_API_KEY, or OIDC on Vercel).
const MODEL = "anthropic/claude-haiku-5.5";

export const myProvider = isTestEnvironment
  ? (() => {
      const {
        artifactModel,
        chatModel,
        reasoningModel,
        titleModel,
      } = require("./models.mock");
      return customProvider({
        languageModels: {
          "chat-model": chatModel,
          "chat-model-reasoning": reasoningModel,
          "title-model": titleModel,
          "artifact-model": artifactModel,
        },
      });
    })()
  : customProvider({
      languageModels: {
        "chat-model": gateway(MODEL),
        "chat-model-reasoning": wrapLanguageModel({
          model: gateway(MODEL),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": gateway(MODEL),
        "artifact-model": gateway(MODEL),
      },
    });