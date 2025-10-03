import { CMEData } from '../types';

// Use the provided NASA API key to avoid rate limits.
const API_KEY = 'tnD5q0sBO7Ea69J9qMchFjOtcHBMTMy7ZVHSwzwy';
const BASE_URL = 'https://api.nasa.gov/DONKI/CME';

export const getRecentCMEs = async (): Promise<CMEData[]> => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const url = `${BASE_URL}?startDate=${formatDate(sevenDaysAgo)}&endDate=${formatDate(today)}&api_key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      // Gracefully handle the "Too Many Requests" error from using the shared DEMO_KEY.
      if (response.status === 429) {
        console.warn("NASA API rate limit reached. Using fallback data. For a stable connection, please provide a NASA_API_KEY environment variable.");
        return []; // Return empty array to prevent app from breaking
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data as CMEData[];
  } catch (error) {
    console.error("Could not fetch space weather data:", error instanceof Error ? error.message : String(error));
    return [];
  }
};