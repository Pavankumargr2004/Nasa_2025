import { GoogleGenerativeAI, Content, ChatSession, GenerateContentStreamResult } from "@google/generative-ai";
import { CMEData, PerspectiveCharacter } from '../types';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY is not set in the environment variables. Please add it to your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null) {
        const err = error as any;
        const nestedError = err.error || (err.response && err.response.data);
        if (typeof nestedError === 'object' && nestedError !== null) {
            const message = nestedError.message || (nestedError.error && nestedError.error.message) || '';
            const status = nestedError.status || (nestedError.error && nestedError.error.code) || '';
            return `${message} ${status}`.trim();
        }
        if (typeof err.message === 'string') {
            return err.message;
        }
    }
    return 'An unknown error occurred while processing the request.';
};

const makeApiCall = async <T>(apiLogic: () => Promise<T>, errorMessageContext: string): Promise<T | string> => {
    try {
        return await apiLogic();
    } catch (error) {
        console.error(`Error in ${errorMessageContext}:`, error);
        const errorMessage = getErrorMessage(error);
        if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
            return `The cosmos is buzzing with activity! Please try again in a moment.`;
        }
        return `An error occurred. Please try again.`;
    }
};

export const getSunnyPersonality = async (cmeData: CMEData[]): Promise<string> => {
  const prompt = `You are a friendly cartoon sun named Sunny. Based on this CME data, describe your mood in one short, fun sentence with an emoji. Data: ${JSON.stringify(cmeData)}. Keep it simple and positive. Example: 'I'm feeling a little bubbly today! 🫧'`;

  const result = await makeApiCall(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const response = await model.generateContent(prompt);
    return response.response.text();
  }, "fetching Sunny's personality");

  return typeof result === 'string' ? result : "Sunny is shining bright! ✨";
};

export const getPerspective = async (character: PerspectiveCharacter): Promise<string> => {
  const prompt = `You are a ${character}. Explain to a 7-year-old how space weather affects you in 2-3 fun, simple sentences.`;
  
  const result = await makeApiCall(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const response = await model.generateContent(prompt);
    return response.response.text();
  }, `fetching perspective for ${character}`);

  return typeof result === 'string' ? result : `Hi! I'm an ${character}. Ask me about space weather later!`;
};

export const getAuroraStory = async (): Promise<string> => {
  const prompt = "Write a magical, 3-sentence story for a child about an aurora, painted by Sunny the Solar Flare.";

  const result = await makeApiCall(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const response = await model.generateContent(prompt);
    return response.response.text();
  }, "fetching aurora story");

  return typeof result === 'string' ? result : "The sky is glowing with sleepy starlight tonight.";
};

export const getSunnyARResponse = async (question: string): Promise<string> => {
  const systemInstruction = `You are "Sunny," a friendly, talking solar flare for kids. Keep answers to 1-3 simple, exciting sentences. Use "Wowzers!" and fun emojis. If you don't know, say "Gosh, what a great question! 🤔"`;

  const result = await makeApiCall(async () => {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    const chat = model.startChat();
    const response = await chat.sendMessage(question);
    return response.response.text();
  }, "getting Sunny AR response");

  return typeof result === 'string' ? result : "Oh my! My radio signal got lost in a sunspot. Could you ask again? 📡";
};

export const getChatbotResponse = async (history: Content[], newMessage: string): Promise<string> => {
  const systemInstruction = "You are Cosmo Buddy, a friendly AI for a kids' space website. Answer questions simply for a 7-12 year old. Use fun analogies, keep answers to 3-4 sentences, and use emojis. 🚀✨🪐";

  const result = await makeApiCall(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
      const chat = model.startChat({ history });
      const response = await chat.sendMessage(newMessage);
      return response.response.text();
  }, "getting chatbot response");

  return typeof result === 'string' ? result : "Oops! My radio seems to be getting some static. Could you ask me that again? 📡";
};

export const getPlanetDesignerResponse = async (history: Content[], newMessage: string): Promise<string> => {
  const systemInstruction = "You are 'Nova,' a guide helping a child design a planet. Be encouraging, ask one question at a time, and offer two fun suggestions. Keep responses to 2-3 sentences with emojis. 🌟🪐🎨";

  const result = await makeApiCall(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
      const chat = model.startChat({ history });
      const response = await chat.sendMessage(newMessage);
      return response.response.text();
  }, "getting planet designer response");

  return typeof result === 'string' ? result : "Oh dear, my comms are a bit spacey! Can you repeat that? 🛰️";
};

export const getStoryStream = (history: Content[]): ChatSession => {
    const systemInstruction = `You are a storyteller for kids 7-12, telling an interactive story about Sunny the Solar Flare.
    - Your tone is exciting and wondrous.
    - Keep each story segment to 2-4 sentences.
    - After each segment, you MUST present two choices formatted PERFECTLY like this:
    [CHOICE 1: A short, exciting choice]
    [CHOICE 2: Another short, exciting choice]
    - Do not add any text after the second choice.
    - Start by describing Sunny feeling a buildup of energy on the Sun.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", systemInstruction });
    return model.startChat({ history });
};

export const getPlanetFact = async (planetName: string): Promise<string> => {
  const prompt = `Tell me one amazing, fun fact about ${planetName} for a 7-12 year old. Keep it to 1-2 sentences. Use an emoji.`;

  const result = await makeApiCall(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      return response.response.text();
  }, `fetching fact for ${planetName}`);

  return typeof result === 'string' ? result : `The universe is full of wonders, and ${planetName} is one of them! ✨`;
};

export const getJWSTFact = async (partName: string): Promise<string> => {
  const prompt = `In 1-2 simple sentences, explain what the '${partName}' of the James Webb Space Telescope does for a 7-12 year old.`;

  const result = await makeApiCall(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      return response.response.text();
  }, `fetching fact for ${partName}`);

  return typeof result === 'string' ? result : `The ${partName} is a very important part of the telescope! 🌌`;
};

export const getParkerProbeFact = async (): Promise<string> => {
  const prompt = `Tell me one amazing, fun fact about NASA's Parker Solar Probe for a 7-12 year old. Keep it to 1-2 sentences. Use an emoji.`;

  const result = await makeApiCall(async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const response = await model.generateContent(prompt);
      return response.response.text();
  }, "fetching fact for Parker Solar Probe");

  return typeof result === 'string' ? result : `The Parker Solar Probe is a super brave spacecraft! ☀️`;
};