export interface APODData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  service_version: string;
  title: string;
  url: string;
}

// Use the provided NASA API key to avoid rate limits.
const API_KEY = 'tnD5q0sBO7Ea69J9qMchFjOtcHBMTMy7ZVHSwzwy';
const BASE_URL = 'https://api.nasa.gov/planetary/apod';

const getRandomDate = (): string => {
    const start = new Date(1995, 5, 16); // APOD start date
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
}

// A predefined fallback object to use when the API fails or is rate-limited.
const fallbackAPODData: APODData = {
    title: "Oops! A Cosmic Hiccup",
    explanation: "We couldn't fetch today's picture from NASA's cosmic gallery due to heavy traffic. It might be lost in a nebula! Please check back later.",
    url: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG9toby1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    date: new Date().toISOString().split('T')[0],
    media_type: 'image',
    service_version: 'v1'
};

export const getAPOD = async (random: boolean = false): Promise<APODData> => {
  const dateParam = random ? `&date=${getRandomDate()}` : '';
  const url = `${BASE_URL}?api_key=${API_KEY}${dateParam}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 429) {
        console.warn("NASA API rate limit reached. Displaying fallback APOD data.");
        // Directly return fallback data to gracefully handle the expected rate limit instead of throwing an error.
        return fallbackAPODData;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as APODData;
  } catch (error) {
    console.error("Could not fetch APOD data:", error instanceof Error ? error.message : String(error));
    // The catch block will now handle other errors like network issues.
    return fallbackAPODData;
  }
};