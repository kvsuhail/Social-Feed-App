import { GoogleGenAI, Type } from "@google/genai";
import { UserLabel, Post, User } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_AVATARS = [
  "https://picsum.photos/seed/user1/150/150",
  "https://picsum.photos/seed/user2/150/150",
  "https://picsum.photos/seed/user3/150/150",
  "https://picsum.photos/seed/user4/150/150",
  "https://picsum.photos/seed/user5/150/150",
];

export const generateFeedContent = async (count: number = 5): Promise<Post[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} realistic social media posts for a platform similar to Instagram but for professionals (Developers, Actors, Musicians). 
      Include a variety of labels. 
      The output must be JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              handle: { type: Type.STRING },
              label: { type: Type.STRING, enum: Object.values(UserLabel) },
              caption: { type: Type.STRING },
              likes: { type: Type.INTEGER },
            },
            required: ["name", "handle", "label", "caption", "likes"]
          }
        }
      }
    });

    const rawData = JSON.parse(response.text || "[]");

    // Hydrate with local data (images, ids) that the LLM cannot generate purely
    return rawData.map((item: any, index: number) => {
      const id = crypto.randomUUID();
      // Deterministic pseudo-random image based on ID for consistency during dev
      const imageSeed = Math.floor(Math.random() * 1000);
      
      const user: User = {
        id: `user-${index}-${imageSeed}`,
        name: item.name,
        handle: item.handle,
        avatarUrl: `https://picsum.photos/seed/${item.handle}/150/150`,
        label: item.label as UserLabel,
        followers: Math.floor(Math.random() * 10000)
      };

      return {
        id: id,
        userId: user.id,
        user: user,
        imageUrl: `https://picsum.photos/seed/${imageSeed}/800/800`, // High res post image
        caption: item.caption,
        likes: item.likes,
        comments: [],
        timestamp: new Date(),
        isLikedByCurrentUser: false
      };
    });

  } catch (error) {
    console.error("Failed to generate feed:", error);
    // Fallback data in case of API failure
    return [];
  }
};
