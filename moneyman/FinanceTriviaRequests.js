import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY });

async function fetchTrivia() {

    const prompt = "Please generate one completely unique \"fun fact\"/trivia item, "
               + "randomly selected "
               + "from one of the following categories: retirement, economic "
               + "indicators, global economics, financial disasters, financial history, "
               + "financial innovations, global currencies, unexpected financial "
               + "sucesses, or online transactions. Pick a category randomly and find "
               + "an INTERESTING trivium within that category "
               + "and respond ONLY with a JSON file using the following fields:\n"
               + "-title: a short summary of the trivium (one sentence, MUST be "
               + "under 30 characters)\n-body: a longer description of the trivium "
               + "(up to 300 words)\nPlease also formulate the response with the "
               + "expectation that it will be read by someone generally kwowedgeable "
               + "of all of the above categories; if talking about something modern "
               + "or if talking about something well known, do NOT simply state its "
               + "existence or that it was important; instead, state a more obscure "
               + "fact about it."

    console.log("getting trivia...");
    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: "gpt-3.5-turbo",
            temperature: Math.random()
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