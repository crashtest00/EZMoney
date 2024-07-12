import Config from 'react-native-config';

async function fetchTrivia(prompt) {
    const apiKey = Config.OPENAI_API_KEY;
    const apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions';

    console.log(Config)

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'text-davinci-003',
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        throw error;
    }
}

export { fetchTrivia };