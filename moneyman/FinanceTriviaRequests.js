import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });

async function fetchTrivia() {

    const prompt = "Please generate one finance-related \"fun fact\"/trivia item, "
               + "and respond ONLY with a JSON file using the following fields:\n"
               + "-title: a short summary of the trivium (one sentence, MUST be "
               + "under 30 characters)\n-body: a longer description of the trivium "
               + "(up to 300 words)"

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