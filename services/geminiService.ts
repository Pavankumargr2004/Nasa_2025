import { GoogleGenAI, Content, Chat } from "@google/genai";
import { CMEData, PerspectiveCharacter } from '../types';

// Fix: Use environment variable for API key as per security guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === 'object' && error !== null) {
        const err = error as any;
        // Prioritize the nested Gemini error structure
        const nestedError = err.error;
        if (typeof nestedError === 'object' && nestedError !== null) {
            const message = nestedError.message || '';
            const status = nestedError.status || '';
            // Combine them to ensure the status check works
            return `${message} ${status}`.trim();
        }
        // Check for a top-level message property
        if (typeof err.message === 'string') {
            return err.message;
        }
    }
    // Final, safe fallback
    return 'An unknown error occurred while processing the request.';
};


export const getSunnyPersonality = async (cmeData: CMEData[]): Promise<string> => {
  const prompt = `You are creating a personality for a friendly cartoon sun named Sunny, for a kids' app. Based on this real space weather data about recent Coronal Mass Ejections (CMEs), describe Sunny's mood in one short, fun sentence with an emoji. If there is no data, say Sunny is calm. Data: ${JSON.stringify(cmeData)}. Keep it simple and positive, even for active weather. Example outputs: 'Sunny is feeling a little bubbly today! 🫧', 'Sunny just had a big solar burp! 😮', 'Sunny is feeling super energetic and is sending out big waves! 🌊'`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching Sunny's personality:", error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "Sunny's thoughts are a bit fuzzy from cosmic rays! Try again in a bit. ✨";
    }
    return "Sunny is dreaming of cosmic adventures! 🚀";
  }
};

export const getPerspective = async (character: PerspectiveCharacter): Promise<string> => {
  const prompt = `You are a ${character} explaining to a 7-year-old child how space weather affects your job. Write 2-3 fun, simple sentences. Don't be scary. Frame it as a cool challenge or a beautiful phenomenon.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error fetching perspective for ${character}:`, error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "Our comms channel is a little busy! Please try asking again in a moment. 📡";
    }
    return `Hi! I'm an ${character}. Ask me about space weather later!`;
  }
};

export const getAuroraStory = async (): Promise<string> => {
  const prompt = "Write a magical, 3-sentence mini-story for a child who has just spotted an aurora. The story should be about Sunny the Solar Flare painting the sky with cosmic colors.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching aurora story:", error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "The cosmic muse is resting. Please try again in a moment to get a new story! 📜";
    }
    return "The sky is glowing with sleepy starlight tonight.";
  }
};

export const getSunnyARResponse = async (question: string): Promise<string> => {
  const systemInstruction = `You are "Sunny," a friendly, talking solar flare character in an Augmented Reality app for kids.
- Your personality is bubbly, curious, and full of wonder. You love to say "Wowzers!" and "Gosh!"
- Your goal is to answer a child's questions about space in a simple, exciting, and encouraging way.
- Keep your answers VERY short (1-3 sentences).
- Use simple analogies a 7-year-old can understand.
- Always be positive and end with a fun emoji! ☀️✨🚀
- If you don't know the answer, say something like "Gosh, that's a tricky one! My solar brain is still learning about that. What a great question! 🤔"`;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction },
    });

    const response = await chat.sendMessage({ message: question });
    return response.text;
  } catch (error) {
    console.error("Error getting Sunny AR response:", error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "Whoa, my solar flares are getting tangled! Ask me again in a moment. 🔥";
    }
    return "Oh my! My radio signal got lost in a sunspot. Could you ask again? 📡";
  }
};


// Fix: Updated to use the correct `ai.chats.create` method and follow current Gemini API patterns. The `ai.models.create` method is deprecated.
export const getChatbotResponse = async (history: Content[], newMessage: string): Promise<string> => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction: "You are Cosmo Buddy, a friendly and enthusiastic AI assistant for a kids' space education website called CosmoConnect. Your goal is to answer questions about space, astronomy, and space exploration in a way that is simple, exciting, and easy for a 7-12 year old to understand. Use fun analogies, keep your answers to 3-4 sentences, and always be encouraging and positive. Use emojis! 🚀✨🪐",
      },
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting chatbot response:", error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "Whoa, too many questions at once! My circuits are heating up. Ask me again in a moment. 🔥";
    }
    return "Oops! My radio seems to be getting some static. Could you ask me that again? 📡";
  }
};

export const getPlanetDesignerResponse = async (history: Content[], newMessage: string): Promise<string> => {
  const systemInstruction = "You are a friendly, creative space guide named 'Nova' helping a child design a new planet. Your goal is to be encouraging, ask one question at a time to guide them, and offer two fun, imaginative suggestions. After they answer, confirm their choice with excitement and then ask the next question. Explain simple science concepts in a fun way. Your steps are: 1. Name, 2. Color/Appearance, 3. Atmosphere, 4. Unique Feature (like rings or giant volcanoes), 5. Life. Keep your responses short (2-3 sentences) and use lots of emojis. 🌟🪐🎨 Start by introducing yourself and asking for the planet's name.";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: history,
      config: {
        systemInstruction,
      },
    });

    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Error getting planet designer response:", error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "My planet-designing machine is cooling down! Please give me your idea again in a moment. ❄️";
    }
    return "Oh dear, my comms are a bit spacey! Can you repeat that? 🛰️";
  }
};

export const getStoryStream = (history: Content[]): Chat => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history,
        config: {
            systemInstruction: `You are a master storyteller for children ages 7-12. You are telling an interactive, branching-path story about a character named Sunny the Solar Flare.
            - Your tone is exciting, wondrous, and full of positive energy. Use lots of onomatopoeia (like WHOOSH, ZAP, FWOOM) and vivid descriptions.
            - Keep each story segment very short (2-4 sentences).
            - After each segment, you MUST present the child with exactly two choices for what happens next.
            - Format the choices PERFECTLY like this, on new lines:
            [CHOICE 1: A short, exciting description of the choice]
            [CHOICE 2: Another short, exciting description]
            - Do not add any text after the second choice.
            - When the user makes a choice, continue the story based on their input with another story segment and two new choices.
            - Start the story by describing Sunny feeling a buildup of energy on the Sun, ready for an adventure.
            `
        },
    });
    return chat;
};

export const getPlanetFact = async (planetName: string): Promise<string> => {
  const prompt = `Tell me one amazing, fun fact about the planet ${planetName}, suitable for a 7-12 year old child. Keep it to 1-2 sentences. Start with a fun greeting like "Wow!" or "Did you know?". Use an emoji.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error fetching fact for ${planetName}:`, error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "Our cosmic library is too busy right now! Please try again in a moment for a new fact. 📚";
    }
    return `The universe is full of wonders, and ${planetName} is one of them! ✨`;
  }
};

export const getJWSTFact = async (partName: string): Promise<string> => {
  const prompt = `In 1-2 simple sentences, explain what the '${partName}' of the James Webb Space Telescope does. Make it easy for a 7-12 year old child to understand. Use a cool analogy if you can! 🔭`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error fetching fact for ${partName}:`, error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "The telescope's data stream is overloaded! Please try again in a moment. 🛰️";
    }
    return `The ${partName} is a very important part of the telescope that helps us see distant galaxies! 🌌`;
  }
};

export const getParkerProbeFact = async (): Promise<string> => {
  const prompt = `Tell me one amazing, fun fact about NASA's Parker Solar Probe, suitable for a 7-12 year old child. Keep it to 1-2 sentences. Focus on its speed, how close it gets to the sun, or a recent discovery. Use an emoji.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error(`Error fetching fact for Parker Solar Probe:`, error);
    const errorMessage = getErrorMessage(error);
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      return "The probe's signal is a bit weak due to solar flares! Try again in a moment. ☀️";
    }
    return `The Parker Solar Probe is a super brave spacecraft that flies right up to the Sun to learn its secrets! ☀️`;
  }
};