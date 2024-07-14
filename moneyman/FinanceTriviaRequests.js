import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });

async function fetchTrivia(prompt) {
    console.log("getting trivia...");
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
        });
        
        const titleAndBody = completion.choices[0].message.content;
        console.log(titleAndBody);
        return JSON.parse(titleAndBody); // Return the fetched data
    } catch (error) {
        console.error('Error handling fetched data:', error);
        throw error; // Re-throw error for handling elsewhere
    }
}

export { fetchTrivia };