const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

const moderateContent = async (content) => {
    try {
        const prompt = `You are a content moderation assistant. Analyze the following user-submitted content and determine if it contains hate speech, profanity, abusive language, spam, or harassment.

Respond ONLY with a valid JSON object in the following format:
{
"is_abusive": true or false,
"reason": "text",
"confidence": number
}

Content: [${content}]`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.1-8b-instant',
            response_format: { type: 'json_object' }
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error('Groq AI Moderation Error:', error);
        // Fallback: If AI fails, allow content but log error (or strictly block, depends on policy)
        return { is_abusive: false, reason: 'AI Error', confidence: 0 };
    }
};

module.exports = { moderateContent };
